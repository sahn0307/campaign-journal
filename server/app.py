#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, g
from flask_restful import Resource
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from marshmallow import Schema, fields, validates, ValidationError, pre_load
from marshmallow.validate import Length
from schemas import UserSchema, CharacterSchema, CampaignSchema, UserUpdateSchema

from config import app, db, api

from models import db, User, Character, Campaign, CharacterCampaign
import ipdb

#! helpers
def execute_query(query):
    return db.session.execute(query).scalars()

def get_all(model):
    # return db.session.execute(select(model)).scalars().all()
    return execute_query(select(model)).all()

def get_instance_by_id(model, id):
    instance = db.session.get(model, id)
    if instance:
        return instance
    else:
        return None

def get_one_by_condition(model, condition):
    # stmt = select(model).where(condition)
    # result = db.session.execute(stmt)
    # return result.scalars().first()
    return execute_query(select(model).where(condition)).first()

def get_all_by_condition(model, condition):
    # stmt = select(model).where(condition)
    # result = db.session.execute(stmt)
    # return result.scalars().all()
    return execute_query(select(model).where(condition)).all()

# ? before request - verify session login
@app.before_request
def load_logged_in_user():
    user_id = session.get("user_id")
    if user_id is None:
        g.user = None
    else:
        g.user = get_instance_by_id(User, user_id)
    #! Refactor this, remove recipebyid + consider additional adds

# ? Base class for CRUD resource classes
class BaseResource(Resource):
    model = None
    schema = None

    def get(self, id=None, condition=None):
        try:
            if id is None and condition is None:
                instances = get_all(self.model)
                return (
                    self.schema.dump(instances, many=True),
                    200,
                )  # Use the schema to serialize the instances
            elif condition is not None:
                instances = get_all_by_condition(self.model, condition)
                return (
                    self.schema.dump(instances, many=True),
                    200,
                )  # Use the schema to serialize the instances
            else:
                instance = get_instance_by_id(self.model, id)
                if instance is None:
                    return {"errors": f"{self.model.__name__} not found"}, 404
                return (
                    self.schema.dump(instance),
                    200,
                )  # Use the schema to serialize the instance
        except SQLAlchemyError as e:
            db.session.rollback()
            return {"errors": str(e)}, 500

    def delete(self, id):
        try:
            instance = get_instance_by_id(self.model, id)
            db.session.delete(instance)
            db.session.commit()
            return "", 204
        except SQLAlchemyError as e:
            db.session.rollback()
            return {"errors": str(e)}, 500

    def post(self, data):
        try:
            data = self.schema.load(
                request.json
            )  # Use the schema to deserialize the request data via load
            instance = self.model(**data)
            db.session.add(instance)
            db.session.commit()
            return (
                self.schema.dump(instance),
                201,
            )  # Use the schema to serialize the instance
        except ValidationError as e:
            return {"message": str(e)}, 422
        except IntegrityError:
            db.session.rollback()
            return {"message": "Invalid data"}, 422

    def patch(self, id):
        try:
            data = request.json
            data = self.schema.load(
                data
            )  # Use the schema to deserialize the request data
            instance = get_instance_by_id(self.model, id)
            for key, value in data.items():
                setattr(instance, key, value)
            db.session.commit()
            return (
                self.schema.dump(instance),
                200,
            )  # Use the schema to serialize the instance
        except ValidationError as e:
            return {"message": str(e)}, 422
        except IntegrityError:
            db.session.rollback()
            return {"message": "Invalid data"}, 422

# ? User Account Signup/Login/Logout/Session Resources
class Signup(Resource):
    model = User
    schema = UserSchema()

    def post(self):
        data = request.json
        self.schema.context = {"is_signup": True}

        try:
            data = self.schema.load(data)
        except ValidationError as err:
            return err.messages, 422

        password = data.pop("password_hash")

        user = User(**data)
        user.password_hash = password

        db.session.add(user)

        db.session.commit()
        # Log the user in
        session["user_id"] = user.id
        session["username"] = user.username
        g.user = user

        return self.schema.dump(user), 201
class CheckSession(Resource):

    def get(self):
        if (user_id := session.get("user_id")) is None:
            return {"message": "Unauthorized"}, 401
        user = get_instance_by_id(User, user_id)
        if user is None:
            return {"message": "Unauthorized"}, 401
        return {
            "id": user.id,
            "username": user.username,
            "bio": user.bio,
            "image_url": user.image_url,
        }, 200

class Login(Resource):
    model = User
    schema = UserSchema()

    def post(self):
        data = request.json
        try:
            data = self.schema.load(data)
        except ValidationError as err:
            return err.messages, 422
        data = self.schema.load(data)
        username = data.get("username")
        password = data.get("password_hash")
        user = get_one_by_condition(User, User.username == username)
        if user is None or not user.authenticate(password):
            return {"message": "Invalid credentials"}, 401
        session["user_id"] = user.id
        session["username"] = user.username
        g.user = user
        return {"id": user.id, "username": user.username}, 200

class Logout(Resource):
    def delete(self):
        if (user_id := session.get("user_id")) is None:
            return {"message": "Unauthorized"}, 401
        session["user_id"] = None
        session["username"] = None
        return {}, 204

class CharacterIndex(BaseResource):
    model = Character
    schema = CharacterSchema()

    def get(self):
        # if (user_id := session.get("user_id")) is None:
        if g.user is None:
            return {"message": "Unauthorized"}, 401
        return super().get(condition=Character.user_id == g.user.id)

    def post(self):
        if g.user is None:
            return {"message": "Unauthorized"}, 401
        data = request.json
        if data is None:
            return {"message": "No data provided"}, 400
        data["user_id"] = g.user.id
        try:
            self.schema.context = {"is_create": True}
            data = self.schema.load(data)
        except ValidationError as err:
            return err.messages, 400
        return super().post(data)

    def delete(self, character_id=None):
        if g.user is None:
            return {"message": "Unauthorized"}, 401
        if character_id is None:
            character_id = g.user.id

        # Get the character
        character = get_instance_by_id(Character, character_id)
        # Check if the character exists
        if not character:
            return {"message": "Character not found"}, 404

        # Delete or reassign all instances that reference the character
        # Assuming you have a relationship similar to CharacterCampaign for characters
        for cc in character.campaigns:
            db.session.delete(cc)

        # Commit the changes
        db.session.commit()

        # Now you can delete the character
        return super().delete(character_id)

    def patch(self, character_id=None):
        if g.user is None:
            return {"message": "Unauthorized"}, 401
        if character_id is None:
            character_id = g.user.id
        data = request.json
        data["user_id"] = g.user.id
        try:
            self.schema.context = {"is_create": False, "id": character_id}
            data = self.schema.load(data)
        except ValidationError as err:
            return err.messages, 400
        return super().patch(character_id)


class UsersIndex(BaseResource):
    model = User
    schema = UserUpdateSchema()

    def get(self):
        # if (user_id := session.get("user_id")) is None:
        # if user_id is None:
        #     if g.user is None:
        #         return {"message": "Unauthorized"}, 401
        #     user_id = g.user.id

        if g.user is None:
            return {"message": "Unauthorized"}, 401
        # id = g.user.id
        return super().get(condition=(User.id == g.user.id))

    # def post(self):
    #     # if (_ := session.get("user_id")) is None:
    #     if g.user is None:
    #         return {"message": "Unauthorized"}, 401
    #     return super().post()

    def delete(self, user_id=None):
        if g.user is None:
            return {"message": "Unauthorized"}, 401
        if user_id is None:
            user_id = g.user.id
        return super().delete(g.user.id)

    def patch(self, user_id=None):
        # if g.user is None:
        #     return {"message": "Unauthorized"}, 401
        # if user_id is None:
        #     user_id = g.user.id
        # self.schema.context = {"is_update": True, "user_id": user_id}
        # return super().patch(user_id)
        if g.user is None:
            return {"message": "Unauthorized"}, 401
        if user_id is None:
            user_id = g.user.id

        # Get the current password from the request data
        current_password = request.json.get('current_password')
        if not current_password:
            return {"message": "Current password is required"}, 400

        # Check if the current password matches the stored password
        if not g.user.authenticate(current_password):
            return {"message": "Current password is incorrect"}, 400

        # Hash the new password before storing it
        new_password = request.json.get('password_hash')
        if new_password:
            g.user.password_hash = new_password

        self.schema.context = {"is_update": True, "user_id": user_id}
        return super().patch(user_id)

class CampaignsIndex(BaseResource):
    model = Campaign
    schema = CampaignSchema()

    def get(self, campaign_id=None):
        if g.user is None:
            return {"message": "Unauthorized"}, 401
        if campaign_id is None:
            campaign_id = g.user.id
        data = super().get(condition=(Campaign.gamemaster_id == g.user.id))
        # If you want to validate or manipulate the data, you can do so here
        # For example, you can load the data into the schema and then dump it again
        # data = self.schema.load(data)
        # data = self.schema.dump(data)
        return data

    def delete(self, campaign_id=None):
        if g.user is None:
            return {"message": "Unauthorized"}, 401
        if campaign_id is None:
            campaign_id = g.user.id

        # Get the campaign
        campaign = get_instance_by_id(Campaign, campaign_id)
        # Check if the campaign exists
        if not campaign:
            return {"message": "Campaign not found"}, 404

        # Delete or reassign all CharacterCampaign instances that reference the campaign
        for cc in campaign.characters:
            db.session.delete(cc)

        # Commit the changes
        db.session.commit()

        # Now you can delete the campaign
        return super().delete(campaign_id)

    def patch(self, campaign_id=None):
        if g.user is None:
            return {"message": "Unauthorized"}, 401
        if campaign_id is None:
            campaign_id = super().get(condition=(Campaign.gamemaster_id == g.user.id))
        if campaign_id is None:
            return {"message": "Campaign not found"}, 404
        data = request.json
        data["gamemaster_id"] = g.user.id
        try:
            self.schema.context = {"is_create": False, "id": campaign_id}
            data = self.schema.load(data)
        except ValidationError as err:
            return err.messages, 400
        return super().patch(campaign_id)

    def post(self, data=None):
        if g.user is None:
            return {"message": "Unauthorized"}, 401
        data = request.json
        if data is None:
            return {"message": "No data provided"}, 400
        data["gamemaster_id"] = g.user.id
        try:
            self.schema.context = {"is_create": True}
            data = self.schema.load(data)
        except ValidationError as err:
            return err.messages, 400
        return super().post(data)


api.add_resource(Signup, "/signup", endpoint="signup")
api.add_resource(CheckSession, "/check_session", endpoint="check_session")
api.add_resource(Login, "/login", endpoint="login")
api.add_resource(Logout, "/logout", endpoint="logout")


api.add_resource(UsersIndex, "/profile", "/profile/<int:user_id>", endpoint="profile")
api.add_resource(
    CharacterIndex,
    "/characters",
    "/characters/<int:character_id>",
    endpoint="characters",
)
api.add_resource(
    CampaignsIndex, "/campaigns", "/campaigns/<int:campaign_id>", endpoint="campaigns"
)

if __name__ == "__main__":
    app.run(port=5555, debug=True)
