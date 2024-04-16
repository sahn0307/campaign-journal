from flask_sqlalchemy import SQLAlchemy
from config import db, bcrypt
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
# from sqlalchemy.sql.expression import text

# db = SQLAlchemy()

class User(db.Model, SerializerMixin):
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

    serialize_rules = (
        "-characters.user",
        "-character_campaigns",
        "-_password_hash",
    )
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

    # def get_default_user_id():
    #     result = db.session.execute(text("SELECT id FROM users LIMIT 1")).first()
    #     return result[0] if result else None

class Character(db.Model, SerializerMixin):
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
    campaigns = db.relationship("CharacterCampaign", back_populates="character")

    # serialize_rules = ("-user.characters", "-campaigns.characters")

class Campaign(db.Model, SerializerMixin):
    __tablename__ = "campaigns"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    description = db.Column(db.Text)
    gamemaster_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    characters = db.relationship("CharacterCampaign", back_populates="campaign")
    
    # serialize_rules = ("characters.campaign", "-characters.campaign.characters")


class CharacterCampaign(db.Model):
    __tablename__ = "character_campaigns"

    character_id = db.Column(db.Integer, db.ForeignKey("characters.id"), primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey("campaigns.id"), primary_key=True)
    gamemaster_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    character = db.relationship("Character", back_populates="campaigns")
    campaign = db.relationship("Campaign", back_populates="characters")
    gamemaster = db.relationship("User", back_populates="character_campaigns")

    # serialize_rules = ("-campaign", "-gamemaster._password_hash", "campaign.character")

    # Quests?