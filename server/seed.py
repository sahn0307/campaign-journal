#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from config import bcrypt
import random
# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db
from models import User, Character, Campaign, CharacterCampaign

# if __name__ == '__main__':
fake = Faker()
#     from app import app
#     from models import db
with app.app_context():
    print("Starting seed...")
    db.drop_all()
    db.create_all()

    # Seed code goes here!
    # Clear existing data
    # Clear existing data
    User.query.delete()
    Character.query.delete()
    Campaign.query.delete()
    CharacterCampaign.query.delete()

    # Create Users
    users = [
        User(
            username=fake.user_name(),
            email=fake.email(),
            game_master=fake.boolean(),
        )
        for _ in range(10)
    ]
    for user in users:
        user.password_hash = "password"
    db.session.add_all(users)
    db.session.commit()

    # Create Characters
    user_ids = [user.id for user in users]
    characters = [
        Character(
            name=fake.name(),
            class_=fake.job(),
            race=fake.random_element(elements=("Elf", "Orc", "Human", "Dwarf")),
            alignment=fake.random_element(
                elements=(
                    "Lawful Good",
                    "Neutral Good",
                    "Chaotic Good",
                    "Lawful Neutral",
                    "True Neutral",
                    "Chaotic Neutral",
                    "Lawful Evil",
                    "Neutral Evil",
                    "Chaotic Evil",
                )
            ),
            age=fake.random_int(min=10, max=100),
            user_id=rc(user_ids),
        )
        for _ in range(20)
    ]
    db.session.add_all(characters)
    db.session.commit()

    # Create Campaigns
    gamemaster_ids = [user.id for user in users if user.game_master]
    campaigns = [
        Campaign(
            name=fake.catch_phrase(),
            description=fake.text(),
            gamemaster_id=rc(gamemaster_ids),
        )
        for _ in range(5)
    ]
    db.session.add_all(campaigns)
    db.session.commit()

    # Create CharacterCampaigns
    character_campaigns = []
    for character in characters:
        campaign = random.choice(campaigns)
        if not any(
            cc
            for cc in character_campaigns
            if cc.character_id == character.id and cc.campaign_id == campaign.id
        ):
            character_campaigns.append(
                CharacterCampaign(
                    character_id=character.id,
                    campaign_id=campaign.id,
                    gamemaster_id=random.choice(user_ids),
                )
            )
    db.session.add_all(character_campaigns)
    db.session.commit()
    print("Seeding Finished...")
