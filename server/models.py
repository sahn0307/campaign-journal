from flask_sqlalchemy import SQLAlchemy
from config import db, bcrypt
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
# from sqlalchemy.sql.expression import text

# db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128))
    game_master = db.Column(db.Boolean, default=False)

    characters = db.relationship("Character", back_populates="user")
    character_campaigns = db.relationship(
        "CharacterCampaign", back_populates="gamemaster"
    )

    @validates("username")
    def validate_username(self, _, username):
        if not isinstance(username, str):
            raise ValueError("Username must be a string")
        elif len(username) < 2:
            raise ValueError("Username must be at least 2 characters long")
        return username
    
    @validates("email")
    def validate_email(self, key, email):
        if not email:
            raise ValueError("Email cannot be empty")
        return email
    
    @hybrid_property
    def password_hash(self):
        raise AttributeError("password_hash is not a readable attribute")

    @password_hash.setter
    def password_hash(self, password):
        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
        self._password_hash = hashed_password

    def authenticate(self, password_to_check):
        return bcrypt.check_password_hash(self._password_hash, password_to_check)

    def __repr__(self):
        return f"User {self.username}, ID: {self.id}"



class Character(db.Model):
    __tablename__ = "characters"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    class_ = db.Column(db.String(64), nullable=False)
    race = db.Column(db.String(64), nullable=False)
    alignment = db.Column(db.String(64), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    alive = db.Column(db.Boolean, default=True)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    user = db.relationship("User", back_populates="characters")
    character_campaigns = db.relationship("CharacterCampaign", back_populates="character")
    campaigns = association_proxy("character_campaigns", "campaign")

    @validates("name")
    def validate_name(self, key, name):
        if not name:
            raise ValueError("Name cannot be empty")
        return name

class Campaign(db.Model):
    __tablename__ = "campaigns"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    description = db.Column(db.Text)
    gamemaster_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    log = db.Column(db.Text(1000))

    character_campaigns = db.relationship("CharacterCampaign", back_populates="campaign")
    characters = association_proxy("character_campaigns", "character")

    @validates("name")
    def validate_name(self, key, name):
        if not name:
            raise ValueError("Name cannot be empty")
        return name

class CharacterCampaign(db.Model):
    __tablename__ = "character_campaigns"

    character_id = db.Column(db.Integer, db.ForeignKey("characters.id"), primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey("campaigns.id"), primary_key=True)
    gamemaster_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    character = db.relationship("Character", back_populates="character_campaigns")
    campaign = db.relationship("Campaign", back_populates="character_campaigns")
    gamemaster = db.relationship("User", back_populates="character_campaigns")

