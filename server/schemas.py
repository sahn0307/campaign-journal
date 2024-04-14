from marshmallow import Schema, fields, validates, ValidationError, pre_load
from marshmallow.validate import Length
from models import db, User, Campaign, Character
from sqlalchemy import select

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(
        required=True,
        validate=Length(min=2),
        metadata={"description": "The unique username of the user"},
    )
    password_hash = fields.Str(
        load_only=True,
        required=True,
        metadata={"description": "The password of the user"},
    )
    email = fields.Str(metadata={"description": "The email of the user"}) #! NEED REGEX! 
    game_master = fields.Boolean(metadata={"description": "The option to determine if this user is a game master or not"})

    @validates("username")
    def validate_username(self, value):
        if self.context.get("is_signup"):
            if get_one_by_condition(User, User.username == value):
                raise ValidationError("Username already exists")
        else:  # This is the login case
            if not get_one_by_condition(User, User.username == value):
                raise ValidationError("Username does not exist")

    @validates("email")
    def validate_email(self, value):
        if self.context.get("is_signup") and get_one_by_condition(
            User, User.email == value
        ):
            raise ValidationError("Email already exists")

    @pre_load
    def strip_strings(self, data, is_signup=None, **kwargs):
        extra_data = kwargs.get("extra_data")
        print(f"Extra data: {extra_data}")
        #! example use of kwags:
        #! user_schema.load(data, extra_data="extra")
        #! can do something with this like logging or tracking things
        for key, value in data.items():
            if isinstance(value, str):
                data[key] = value.strip()
        return data

class CampaignSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(
        required=True,
        validate=Length(min=2),
        metadata={"description": "The unique name of the campaign"},
    )
    description = fields.Str(
        metadata={"description": "The description of the campaign"}
    )
    gamemaster_id = fields.Int(
        metadata={"description": "The ID of the game master of the campaign"}
    )

    @validates("name")
    def validate_name(self, value):
        if self.context.get("is_create"):
            if get_one_by_condition(Campaign, Campaign.name == value):
                raise ValidationError("Campaign name already exists")
        else:  # This is the update case
            if not get_one_by_condition(Campaign, Campaign.name == value):
                raise ValidationError("Campaign name does not exist")

    @pre_load
    def strip_strings(self, data, **kwargs):
        for key, value in data.items():
            if isinstance(value, str):
                data[key] = value.strip()
        return data


class CharacterSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(
        required=True,
        validate=Length(min=2),
        metadata={"description": "The unique name of the character"},
    )
    class_ = fields.Str(metadata={"description": "The class of the character"})
    race = fields.Str(metadata={"description": "The race of the character"})
    alignment = fields.Str(metadata={"description": "The alignment of the character"})
    age = fields.Int(metadata={"description": "The age of the character"})
    alive = fields.Boolean(metadata={"description": "The alive status of the character"})
    description = fields.Str(metadata={"description": "The description of the character"})
    user_id = fields.Int(metadata={"description": "The user id associated with the character"})

    @pre_load
    def strip_strings(self, data, character_id = None, **kwargs):
        for key, value in data.items():
            if isinstance(value, str):
                data[key] = value.strip()
        return data
    

#! Helper Functions

def get_one_by_condition(model, condition):
    # stmt = select(model).where(condition)
    # result = db.session.execute(stmt)
    # return result.scalars().first()
    return execute_query(select(model).where(condition)).first()

def execute_query(query):
    return db.session.execute(query).scalars()