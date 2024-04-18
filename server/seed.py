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

# from app import app
# from models import db
with app.app_context():
    print("Starting seed...")
    db.drop_all()
    db.create_all()

    # Seed code goes here!
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
    character_classes = ["Warrior", "Mage", "Hunter", "Priest", "Rogue", "Bard"]
    character_names = [
        "Aric Shadowbane",
        "Kaelin Stormbringer",
        "Eldrin Lightfoot",
        "Sylas Ironheart",
        "Mirabel Starfire",
        "Thalia Moonwhisper",
        "Caelum Sunward",
        "Lysander Blackwood",
        "Rowan Frostfang",
        "Nyssa Everglade",
        "Drystan Thundershield",
        "Azura Windwalker",
        "Fenris Darkwater",
        "Idris Flamecaller",
        "Elowen Silverstream",
        "Orion Nightbreeze",
        "Vesper Goldweaver",
        "Seraphina Brightspear",
        "Roran Skywarden",
        "Mira Wildthorn",
    ]
    characters = [
        Character(
            name=rc(character_names),
            class_=rc(character_classes),
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
            name="The Quest for the Shattered Crown",
            description="Embark on a perilous journey to recover the fragments of the ancient Shattered Crown. Unite the pieces to restore balance to the realm.",
            gamemaster_id=rc(gamemaster_ids),
        ),
        Campaign(
            name="Shadows of the Forsaken Tower",
            description="Investigate the dark secrets lurking within the abandoned Forsaken Tower. Uncover the truth behind the tower's haunted history.",
            gamemaster_id=rc(gamemaster_ids),
        ),
        Campaign(
            name="The Curse of the Crimson Moon",
            description="A mysterious curse has befallen the land, turning the moon crimson. Race against time to unravel the curse's origins and save the kingdom.",
            gamemaster_id=rc(gamemaster_ids),
        ),
        Campaign(
            name="The Lost City of Araknor",
            description="Explore the ruins of the legendary lost city of Araknor. Discover its hidden treasures and face the ancient guardians that protect them.",
            gamemaster_id=rc(gamemaster_ids),
        ),
        Campaign(
            name="The Rise of the Necromancer",
            description="A powerful necromancer threatens to raise an army of the undead. Join forces with brave heroes to stop the necromancer's nefarious plans.",
            gamemaster_id=rc(gamemaster_ids),
        ),
        Campaign(
            name="The Sunken Isles of the Serpent King",
            description="Sail to the mysterious Sunken Isles, rumored to be the resting place of the Serpent King's treasure. Navigate treacherous waters and face mythical creatures.",
            gamemaster_id=rc(gamemaster_ids),
        ),
        Campaign(
            name="The Whispering Woods of Elenoria",
            description="Venture into the enchanted Whispering Woods of Elenoria. Unravel the secrets of the forest and seek the wisdom of the ancient tree spirits.",
            gamemaster_id=rc(gamemaster_ids),
        ),
        Campaign(
            name="The Clockwork Citadel of Zephyrus",
            description="Infiltrate the Clockwork Citadel of Zephyrus, a fortress of mechanical wonders. Outwit the citadel's intricate traps and confront the mad artificer who resides within.",
            gamemaster_id=rc(gamemaster_ids),
        ),
        Campaign(
            name="The Shadowed Veil of Morrigan",
            description="Step into the Shadowed Veil of Morrigan, a realm of eternal twilight. Navigate the politics of the shadow court and uncover a plot that threatens both worlds.",
            gamemaster_id=rc(gamemaster_ids),
        ),
        Campaign(
            name="The Elemental Plane of Chaos",
            description="Embark on a planar journey to the Elemental Plane of Chaos. Harness the power of the elements and restore order to the plane before it consumes all of existence.",
            gamemaster_id=rc(gamemaster_ids),
        ),
        Campaign(
            name="The Quest for the Shattered Crown",
            description="Embark on a perilous journey to recover the fragments of the ancient Shattered Crown. Unite the pieces to restore balance to the realm.",
            gamemaster_id=rc(gamemaster_ids),
        ),
        Campaign(
            name="Shadows of the Forsaken Tower",
            description="Investigate the dark secrets lurking within the abandoned Forsaken Tower. Uncover the truth behind the tower's haunted history.",
            gamemaster_id=rc(gamemaster_ids),
        ),
        Campaign(
            name="The Curse of the Crimson Moon",
            description="A mysterious curse has befallen the land, turning the moon crimson. Race against time to unravel the curse's origins and save the kingdom.",
            gamemaster_id=rc(gamemaster_ids),
        ),
        Campaign(
            name="The Lost City of Araknor",
            description="Explore the ruins of the legendary lost city of Araknor. Discover its hidden treasures and face the ancient guardians that protect them.",
            gamemaster_id=rc(gamemaster_ids),
        ),
        Campaign(
            name="The Rise of the Necromancer",
            description="A powerful necromancer threatens to raise an army of the undead. Join forces with brave heroes to stop the necromancer's nefarious plans.",
            gamemaster_id=rc(gamemaster_ids),
        ),
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
