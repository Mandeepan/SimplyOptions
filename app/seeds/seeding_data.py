users = [
    {
        "first_name": "Mandy",
        "last_name": "Demo-Non-Issuer",
        "email": "nonissuerdemo@simplyoptions.com",
        "password": "password123",
        "user_cash_balance": 1000.0,
        "amount_to_be_debited": 100.0,
        "amount_to_be_credited": 50.0,
        "user_available_balance": 950.0,
        "is_issuer": 0,
        "company_id": None
    },
    {
        "first_name": "Mandy",
        "last_name": "Demo-Issuer",
        "email": "issuerdemo@simplyoptions.com",
        "password": "password456",
        "user_cash_balance": 1500.0,
        "amount_to_be_debited": 200.0,
        "amount_to_be_credited": 75.0,
        "user_available_balance": 1275.0,
        "is_issuer": 1,
        "company_id": 1
    },
    {
        "first_name": "Carol",
        "last_name": "Davis",
        "email": "carol.davis@simplyoption.com",
        "password": "password789",
        "user_cash_balance": 2000.0,
        "amount_to_be_debited": 150.0,
        "amount_to_be_credited": 100.0,
        "user_available_balance": 1850.0,
        "is_issuer": 0,
        "company_id": None
    },
    {
        'first_name': 'Alice',
        'last_name': 'Johnson',
        'email': 'alice.johnson@simplyoption.com',
        'password': 'alicejohnsonpassword',
        'user_cash_balance': 2500.00,
        'amount_to_be_debited': 300.00,
        'amount_to_be_credited': 120.00,
        'user_available_balance': 2180.00,
        'is_issuer': 0,
        'company_id': None,
    },
    {
        'first_name': 'Robert',
        'last_name': 'Smith',
        'email': 'robert.smith@simplyoption.com',
        'password': 'robertsmithpassword',
        'user_cash_balance': 3000.00,
        'amount_to_be_debited': 400.00,
        'amount_to_be_credited': 150.00,
        'user_available_balance': 2650.00,
        'is_issuer': 1,
        'company_id': 2,
    }
]


companies = [
    {
        "company_name": "OpenAI",
        "operating_status": "Active",
        "location_identifier": "San Francisco, California, United States",
        "short_description": "OpenAI is an AI research and deployment company that develops advanced AI models, including ChatGPT.",
        "founded_year": 2015,
        "num_employees_enum": "251-500",
        "revenue_range": "$1B to $10B",
        "website_url": "www.openai.com",
        "investors": "NVIDIA, Citi, HSBC, Thrive Capital, Khosla Ventures"
    },
    {
        "company_name": "Anthropic",
        "operating_status": "Active",
        "location_identifier": "San Francisco, California, United States",
        "short_description": "Anthropic is an IT safety and research company that focuses on increasing the safety of large-scale AI systems.",
        "founded_year": 2021,
        "num_employees_enum": "501-1000",
        "revenue_range": "",
        "website_url": "www.anthropic.com",
        "investors": "Amazon, FTX, Bossanova Investimentos, Google, Menlo Ventures"
    },
    {
        "company_name": "Perplexity",
        "operating_status": "Active",
        "location_identifier": "San Francisco, California, United States",
        "short_description": "Perplexity is an AI-chat-based conversational search engine that delivers answers to questions using language models.",
        "founded_year": 2022,
        "num_employees_enum": "11-50",
        "revenue_range": "$50M to $100M",
        "website_url": "www.perplexity.ai",
        "investors": "NVIDIA, Bossanova Investimentos, Bessemer Venture Partners, Wayra, New Enterprise Associates"
    },
    {
        "company_name": "xAI",
        "operating_status": "Active",
        "location_identifier": "Burlingame, California, United States",
        "short_description": "XAI is an AI company that develops a platform to accelerate human scientific discovery.",
        "founded_year": 2023,
        "num_employees_enum": "11-50",
        "revenue_range": "",
        "website_url": "xa.ai",
        "investors": "Bossanova Investimentos, Andreessen Horowitz, Valor Equity Partners, Sequoia Capital, Fidelity"
    },
    {
        "company_name": "Bluesky",
        "operating_status": "Active",
        "location_identifier": "Seattle, Washington, United States",
        "short_description": "Bluesky is a social media platform fostering open connections and creativity.",
        "founded_year": 2021,
        "num_employees_enum": "11-50",
        "revenue_range": "",
        "website_url": "blueskyweb.xyz",
        "investors": "Protocol Labs, Automattic, Alumni Ventures, Outset Capital, Blockchain Capital"
    },
    {
        "company_name": "Polymarket",
        "operating_status": "Active",
        "location_identifier": "New York, New York, United States",
        "short_description": "Polymarket is a prediction market platform where traders predict future event outcomes, reacting to news in real time.",
        "founded_year": 2020,
        "num_employees_enum": "11-50",
        "revenue_range": "$1M to $10M",
        "website_url": "polymarket.com",
        "investors": "General Catalyst, Polychain, Dragonfly, Founders Fund, Robot Ventures"
    },
    {
        "company_name": "CoreWeave",
        "operating_status": "Active",
        "location_identifier": "Roseland, New Jersey, United States",
        "short_description": "CoreWeave is an AI hyperscaler that delivers a cloud platform managing complexity through automation, and making supercomputing accessible.",
        "founded_year": 2017,
        "num_employees_enum": "501-1000",
        "revenue_range": "$10M to $50M",
        "website_url": "www.coreweave.com",
        "investors": "NVIDIA, Citi, BlackRock, Deutsche Bank, Fidelity"
    },
    {
        "company_name": "Neuralink",
        "operating_status": "Active",
        "location_identifier": "Fremont, California, United States",
        "short_description": "Neuralink develops a brain machine interface that provides solutions for those with paralysis.",
        "founded_year": 2016,
        "num_employees_enum": "251-500",
        "revenue_range": "$10M to $50M",
        "website_url": "www.neuralink.com",
        "investors": "Craft Ventures, Valor Equity Partners, Founders Fund, Google Ventures, UpHonest Capital"
    },
    {
        "company_name": "Cyera",
        "operating_status": "Active",
        "location_identifier": "New York, New York, United States",
        "short_description": "Cyera is an AI-powered data security platform that gives enterprises deep context on their data to assure cyber-resilience and compliance.",
        "founded_year": 2021,
        "num_employees_enum": "251-500",
        "revenue_range": "",
        "website_url": "cyera.io",
        "investors": "Accel, Sequoia Capital, Sapphire Ventures, Coatue, Georgian"
    },
    {
        "company_name": "Centrus Energy",
        "operating_status": "Active",
        "location_identifier": "Bethesda, Maryland, United States",
        "short_description": "Centrus Energy is a company that engaged in the supply of nuclear fuel and services for the nuclear power industry.",
        "founded_year": 1998,
        "num_employees_enum": "251-500",
        "revenue_range": "$100M to $500M",
        "website_url": "www.centrusenergy.com",
        "investors": "US Department of Energy"
    },
    {
        "company_name": "SpaceX",
        "operating_status": "Active",
        "location_identifier": "Hawthorne, California, United States",
        "short_description": "SpaceX is an aviation and aerospace company that focuses on reducing the costs associated with space travel by using reusable rockets.",
        "founded_year": 2002,
        "num_employees_enum": "1001-5000",
        "revenue_range": "$1B to $10B",
        "website_url": "www.spacex.com",
        "investors": "Saudi Arabia's Public Investment Fund, Intesa Sanpaolo, Craft Ventures, Google, Sequoia Capital"
    },
    {
        "company_name": "Techstars",
        "operating_status": "Active",
        "location_identifier": "Boulder, Colorado, United States",
        "short_description": "Techstars is an accelerator that provides pre-seed investment and mentoring for various early stage startups.",
        "founded_year": 2006,
        "num_employees_enum": "251-500",
        "revenue_range": "$100M to $500M",
        "website_url": "www.techstars.com",
        "investors": "Mercury, Lightbank, Silicon Valley Bank, Foundry Group, SVB Financial Group"
    },
    {
        "company_name": "Bugcrowd",
        "operating_status": "Active",
        "location_identifier": "San Francisco, California, United States",
        "short_description": "Bugcrowd is a cybersecurity company that operates as a platform for crowdsourced security testing.",
        "founded_year": 2012,
        "num_employees_enum": "251-500",
        "revenue_range": "$50M to $100M",
        "website_url": "bugcrowd.com",
        "investors": "Startmate, General Catalyst, Paladin Capital Group, Rally Ventures, Partech"
    },
    {
        "company_name": "Physical Intelligence",
        "operating_status": "Active",
        "location_identifier": "San Francisco, California, United States",
        "short_description": "Physical Intelligence is an AI company developing machine learning for robots and other physical devices.",
        "founded_year": 2024,
        "num_employees_enum": "11-50",
        "revenue_range": "",
        "website_url": "physicalintelligence.company",
        "investors": "OpenAI, Thrive Capital, Khosla Ventures, Sequoia Capital, Bond"
    },
    {
        "company_name": "Carbon Robotics",
        "operating_status": "Active",
        "location_identifier": "Seattle, Washington, United States",
        "short_description": "Carbon Robotics is an AI-powered farming robotics company enhancing efficiency with precision agriculture tools.",
        "founded_year": 2018,
        "num_employees_enum": "101-250",
        "revenue_range": "$1M to $10M",
        "website_url": "carbonrobotics.com",
        "investors": "Liquid 2 Ventures, NVentures, Revolution, Bond, Anthos Capital"
    },
    {
        "company_name": "Hulu",
        "operating_status": "Active",
        "location_identifier": "Los Angeles, California, United States",
        "short_description": "Hulu is an online video service that offers a selection of hit shows, clips, movies, and documentaries through its website.",
        "founded_year": 2007,
        "num_employees_enum": "1001-5000",
        "revenue_range": "$1B to $10B",
        "website_url": "www.hulu.com",
        "investors": "The Walt Disney Company, Providence Equity Partners, WarnerMedia"
    },
    {
        "company_name": "Read AI",
        "operating_status": "Active",
        "location_identifier": "Seattle, Washington, United States",
        "short_description": "Read AI is a productivity AI company that enhances workflows with meeting analytics, scheduling, and summaries across messages and email.",
        "founded_year": 2021,
        "num_employees_enum": "11-50",
        "revenue_range": "$1M to $10M",
        "website_url": "www.read.ai",
        "investors": "Goodwater Capital, Madrona, PSL Ventures, Smash Capital, Brian Ma"
    },
    {
        "company_name": "Writer",
        "operating_status": "Active",
        "location_identifier": "San Francisco, California, United States",
        "short_description": "Writer is a software firm that develops a full-stack generative AI platform delivering transformative ROI for enterprises.",
        "founded_year": 2020,
        "num_employees_enum": "101-250",
        "revenue_range": "",
        "website_url": "writer.com",
        "investors": "B Capital, Accenture, ICONIQ Growth, Insight Partners, Radical Ventures"
    },
    {
        "company_name": "Interos",
        "operating_status": "Active",
        "location_identifier": "Arlington, Virginia, United States",
        "short_description": "Interos helps companies manage risk and continuously monitor their supply chain and business relationships to avoid disruptions.",
        "founded_year": 2005,
        "num_employees_enum": "251-500",
        "revenue_range": "$1M to $10M",
        "website_url": "www.interos.ai",
        "investors": "Blue Owl, Kleiner Perkins, Venrock, Accenture Ventures, NightDragon"
    },
    {
        "company_name": "ConsenSys",
        "operating_status": "Active",
        "location_identifier": "Brooklyn, New York, United States",
        "short_description": "ConsenSys builds Ethereum blockchain infrastructure and applications ranging from developer tools to enterprise solutions.",
        "founded_year": 2014,
        "num_employees_enum": "501-1000",
        "revenue_range": "$100M to $500M",
        "website_url": "consensys.io",
        "investors": "Temasek Holdings, HSBC, BlackRock, Protocol Labs, Animoca Brands"
    },
    {
        "company_name": "Stonepeak",
        "operating_status": "Active",
        "location_identifier": "New York, New York, United States",
        "short_description": "Stonepeak Infrastructure Partners invests in infrastructure assets with stable cash flows, inflation linkage, and high barriers to entry.",
        "founded_year": 2011,
        "num_employees_enum": "101-250",
        "revenue_range": "$1M to $10M",
        "website_url": "stonepeak.com",
        "investors": "Greenspring Associates, Dyal Capital Partners, Landmark Partners"
    },
    {
        "company_name": "Socure",
        "operating_status": "Active",
        "location_identifier": "Incline Village, Nevada, United States",
        "short_description": "Socure is a predictive analytics platform for digital identity verification of consumers.",
        "founded_year": 2012,
        "num_employees_enum": "501-1000",
        "revenue_range": "$100M to $500M",
        "website_url": "www.socure.com",
        "investors": "Accel, Citi Ventures, Two Sigma Ventures, Bain Capital Ventures, Synchrony"
    },
    {
        "company_name": "Starfish Space",
        "operating_status": "Active",
        "location_identifier": "Tukwila, Washington, United States",
        "short_description": "Starfish Space develops and manufactures autonomous space vehicles that perform in-orbit, satellite servicing missions.",
        "founded_year": 2018,
        "num_employees_enum": "11-50",
        "revenue_range": "$10M to $50M",
        "website_url": "www.starfishspace.com",
        "investors": "Alumni Ventures, Point72 Ventures, Trousdale Ventures, Creative Destruction Lab (CDL), Toyota Ventures"
    },
    {
        "company_name": "Firefly Aerospace",
        "operating_status": "Active",
        "location_identifier": "Cedar Park, Texas, United States",
        "short_description": "Firefly Aerospace is an end-to-end responsive space services company that provides space access for government and commercial customers.",
        "founded_year": 2014,
        "num_employees_enum": "501-1000",
        "revenue_range": "$100M to $500M",
        "website_url": "fireflyspace.com/",
        "investors": "Human Element VC, SeedInvest, AE Industrial Partners, RPM Ventures, XBTO Group"
    }
]


instruments = [
    {
        "company_id": 1,
        "instrument_name": "OpenAI Common Share",
        "issuer_user_id": 2,
        "issued_on_et": "2024-10-01",
        "instrument_type": "Common Share",
        "instrument_class": "Class A",
        "updated_value": 12500.0,
        "updated_issued_quantity": 1000,
        "updated_price": 12.5
    },
    {
        "company_id": 1,
        "instrument_name": "OpenAI Preferred Share",
        "issuer_user_id": 5,
        "issued_on_et": "2024-10-05",
        "instrument_type": "Preferred Share",
        "instrument_class": "Class B",
        "updated_value": 11250.0,
        "updated_issued_quantity": 750,
        "updated_price": 15.0
    },
    {
        "company_id": 2,
        "instrument_name": "Anthropic Common Share",
        "issuer_user_id": 6,
        "issued_on_et": "2024-09-15",
        "instrument_type": "Common Share",
        "instrument_class": "Class A",
        "updated_value": 30000.0,
        "updated_issued_quantity": 1500,
        "updated_price": 20.0
    },
    {
        "company_id": 2,
        "instrument_name": "Anthropic Executive Share",
        "issuer_user_id": 6,
        "issued_on_et": "2024-09-20",
        "instrument_type": "Executive Share",
        "instrument_class": "Class C",
        "updated_value": 6000.0,
        "updated_issued_quantity": 200,
        "updated_price": 30.0
    },
    {
        "company_id": 3,
        "instrument_name": "Perplexity Preferred Share",
        "issuer_user_id": 7,
        "issued_on_et": "2024-08-10",
        "instrument_type": "Preferred Share",
        "instrument_class": "Class B",
        "updated_value": 15400.0,
        "updated_issued_quantity": 400,
        "updated_price": 38.5
    },
    {
        "company_id": 3,
        "instrument_name": "Perplexity Common Share",
        "issuer_user_id": 7,
        "issued_on_et": "2024-08-12",
        "instrument_type": "Common Share",
        "instrument_class": "Class A",
        "updated_value": 11000.0,
        "updated_issued_quantity": 500,
        "updated_price": 22.0
    },
    {
        "company_id": 4,
        "instrument_name": "xAI Executive Share",
        "issuer_user_id": 8,
        "issued_on_et": "2024-07-18",
        "instrument_type": "Executive Share",
        "instrument_class": "Class C",
        "updated_value": 15000.0,
        "updated_issued_quantity": 300,
        "updated_price": 50.0
    },
    {
        "company_id": 5,
        "instrument_name": "Bluesky Common Share",
        "issuer_user_id": 9,
        "issued_on_et": "2024-06-30",
        "instrument_type": "Common Share",
        "instrument_class": "Class A",
        "updated_value": 11400.0,
        "updated_issued_quantity": 1200,
        "updated_price": 9.5
    },
    {
        "company_id": 5,
        "instrument_name": "Bluesky Preferred Share",
        "issuer_user_id": 9,
        "issued_on_et": "2024-07-01",
        "instrument_type": "Preferred Share",
        "instrument_class": "Class B",
        "updated_value": 8800.0,
        "updated_issued_quantity": 800,
        "updated_price": 11.0
    },
    {
        "company_id": 6,
        "instrument_name": "Polymarket Preferred Share",
        "issuer_user_id": 10,
        "issued_on_et": "2024-05-20",
        "instrument_type": "Preferred Share",
        "instrument_class": "Class B",
        "updated_value": 7600.0,
        "updated_issued_quantity": 950,
        "updated_price": 8.0
    },
    {
        "company_id": 6,
        "instrument_name": "Polymarket Common Share",
        "issuer_user_id": 10,
        "issued_on_et": "2024-05-22",
        "instrument_type": "Common Share",
        "instrument_class": "Class A",
        "updated_value": 8250.0,
        "updated_issued_quantity": 1500,
        "updated_price": 5.5
    },
    {
        "company_id": 7,
        "instrument_name": "CoreWeave Executive Share",
        "issuer_user_id": 11,
        "issued_on_et": "2024-04-15",
        "instrument_type": "Executive Share",
        "instrument_class": "Class C",
        "updated_value": 10000.0,
        "updated_issued_quantity": 400,
        "updated_price": 25.0
    },
    {
        "company_id": 8,
        "instrument_name": "Neuralink Common Share",
        "issuer_user_id": 12,
        "issued_on_et": "2024-03-18",
        "instrument_type": "Common Share",
        "instrument_class": "Class A",
        "updated_value": 14500.0,
        "updated_issued_quantity": 725,
        "updated_price": 20.0
    },
    {
        "company_id": 8,
        "instrument_name": "Neuralink Preferred Share",
        "issuer_user_id": 12,
        "issued_on_et": "2024-03-25",
        "instrument_type": "Preferred Share",
        "instrument_class": "Class B",
        "updated_value": 10250.0,
        "updated_issued_quantity": 500,
        "updated_price": 20.5
    },
    {
        "company_id": 9,
        "instrument_name": "Cyera Executive Share",
        "issuer_user_id": 13,
        "issued_on_et": "2024-02-12",
        "instrument_type": "Executive Share",
        "instrument_class": "Class C",
        "updated_value": 9600.0,
        "updated_issued_quantity": 320,
        "updated_price": 30.0
    },
    {
        "company_id": 10,
        "instrument_name": "Centrus Energy Preferred Share",
        "issuer_user_id": 14,
        "issued_on_et": "2024-01-29",
        "instrument_type": "Preferred Share",
        "instrument_class": "Class B",
        "updated_value": 16500.0,
        "updated_issued_quantity": 550,
        "updated_price": 30.0
    },
    {
        "company_id": 10,
        "instrument_name": "Centrus Energy Common Share",
        "issuer_user_id": 14,
        "issued_on_et": "2024-02-01",
        "instrument_type": "Common Share",
        "instrument_class": "Class A",
        "updated_value": 25000.0,
        "updated_issued_quantity": 1250,
        "updated_price": 20.0
    }
]


instrument_prices = [
    {
        "instrument_id": 1,
        "recorded_on_et": "2024-10-02",
        "recorded_price": 12.8
    },
    {
        "instrument_id": 1,
        "recorded_on_et": "2024-10-10",
        "recorded_price": 13.0
    },
    {
        "instrument_id": 1,
        "recorded_on_et": "2024-10-15",
        "recorded_price": 13.2
    },
    {
        "instrument_id": 2,
        "recorded_on_et": "2024-10-06",
        "recorded_price": 15.2
    },
    {
        "instrument_id": 2,
        "recorded_on_et": "2024-10-12",
        "recorded_price": 15.5
    },
    {
        "instrument_id": 2,
        "recorded_on_et": "2024-10-18",
        "recorded_price": 15.8
    },
        {
        "instrument_id": 3,
        "recorded_on_et": "2024-10-02",
        "recorded_price": 22.8
    },
    {
        "instrument_id": 3,
        "recorded_on_et": "2024-10-10",
        "recorded_price": 23.0
    },
    {
        "instrument_id": 3,
        "recorded_on_et": "2024-10-15",
        "recorded_price": 30.2
    },
        {
        "instrument_id": 4,
        "recorded_on_et": "2023-10-02",
        "recorded_price": 12.8
    },
    {
        "instrument_id": 4,
        "recorded_on_et": "2024-10-10",
        "recorded_price": 50.0
    },
    {
        "instrument_id": 4,
        "recorded_on_et": "2024-10-15",
        "recorded_price": 48.2
    },
        {
        "instrument_id": 5,
        "recorded_on_et": "2022-10-02",
        "recorded_price": 6.8
    },
    {
        "instrument_id": 5,
        "recorded_on_et": "2024-06-10",
        "recorded_price": 13.0
    },
    {
        "instrument_id": 5,
        "recorded_on_et": "2024-10-15",
        "recorded_price": 59.2
    },
        {
        "instrument_id": 6,
        "recorded_on_et": "2024-10-15",
        "recorded_price": 59.2
    },
    {
        "instrument_id": 7,
        "recorded_on_et": "2024-10-15",
        "recorded_price": 59.2
    },
    {
        "instrument_id": 8,
        "recorded_on_et": "2024-10-15",
        "recorded_price": 59.2
    },
    {
        "instrument_id": 9,
        "recorded_on_et": "2024-10-15",
        "recorded_price": 59.2
    },
    {
        "instrument_id": 10,
        "recorded_on_et": "2024-10-15",
        "recorded_price": 59.2
    },
    {
        "instrument_id": 11,
        "recorded_on_et": "2024-10-15",
        "recorded_price": 59.2
    },
    {
        "instrument_id": 12,
        "recorded_on_et": "2024-10-15",
        "recorded_price": 59.2
    },
    {
        "instrument_id": 13,
        "recorded_on_et": "2024-10-15",
        "recorded_price": 59.2
    },
    {
        "instrument_id": 14,
        "recorded_on_et": "2024-10-15",
        "recorded_price": 59.2
    },
    {
        "instrument_id": 15,
        "recorded_on_et": "2024-10-15",
        "recorded_price": 59.2
    },
]


offers = [
    {
        "instrument_id": 1,
        "offer_user_id": 3,
        "status": "Not Filled",
        "offered_price": 12.8,
        "initial_quantity": 100,
        "remaining_quantity": 100,
        "offered_on_et": "2024-10-02",
        "settled_on_et": None,
    },
    {
        "instrument_id": 1,
        "offer_user_id": 4,
        "status": "Not Filled",
        "offered_price": 10,
        "initial_quantity": 200,
        "remaining_quantity": 200,
        "offered_on_et": "2024-10-03",
        "settled_on_et": None,
    },
    {
        "instrument_id": 2,
        "offer_user_id": 5,
        "status": "Partially Filled",
        "offered_price": 15.0,
        "initial_quantity": 200,
        "remaining_quantity": 100,
        "offered_on_et": "2024-10-06",
        "settled_on_et": None,
    },
    {
        "instrument_id": 2,
        "offer_user_id": 2,
        "status": "Partially Filled",
        "offered_price": 15.0,
        "initial_quantity": 200,
        "remaining_quantity": 100,
        "offered_on_et": "2024-10-06",
        "settled_on_et": None,
    },
    {
        "instrument_id": 3,
        "offer_user_id": 4,
        "status": "Filled",
        "offered_price": 20.5,
        "initial_quantity": 150,
        "remaining_quantity": 0,
        "offered_on_et": "2024-09-15",
        "settled_on_et": "2024-09-20",
    },
    {
        "instrument_id": 4,
        "offer_user_id": 2,
        "status": "Not Filled",
        "offered_price": 30.0,
        "initial_quantity": 300,
        "remaining_quantity": 300,
        "offered_on_et": "2024-09-25",
        "settled_on_et": None,
    },
    {
        "instrument_id": 5,
        "offer_user_id": 1,
        "status": "Partially Filled",
        "offered_price": 38.5,
        "initial_quantity": 400,
        "remaining_quantity": 50,
        "offered_on_et": "2024-08-15",
        "settled_on_et": None,
    },
    {
        "instrument_id": 6,
        "offer_user_id": 5,
        "status": "Filled",
        "offered_price": 22.0,
        "initial_quantity": 500,
        "remaining_quantity": 0,
        "offered_on_et": "2024-08-18",
        "settled_on_et": "2024-08-22",
    },
]