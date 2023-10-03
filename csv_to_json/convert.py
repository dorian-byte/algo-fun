import csv
import json
import datetime
import pytz

csvFilePath = "./data.csv"
california = pytz.timezone("America/Los_Angeles")
current_time = datetime.datetime.now(california)

data = {}
with open(csvFilePath) as csvFile:
    csvReader = csv.DictReader(csvFile)
    for rows in csvReader:
        id = rows["id"]
        data[id] = r
data = list(data.values())
res = []
companies = set()
topics = set()
for idx, row in enumerate(data):
    if not row["companies"]:
        row_companies = []
    else:
        row_companies = [item.strip() for item in row["companies"].lower().split(",")]
    if not row["related_topics"]:
        row_topics = []
    else:
        row_topics = [item.strip() for item in row["related_topics"].lower().split(",")]

    companies.update(row_companies)
    topics.update(row_topics)

    res.append(
        {
            "model": "algofun.problem",
            "pk": idx + 1,
            "fields": {
                "title": row["title"],
                "leetcode_number": int(row["id"]),
                "description": row["description"],
                "created_at": current_time.isoformat(),
                "updated_at": current_time.isoformat(),
                "time_complexity_requirement": None,
                "space_complexity_requirement": None,
                "source": 1,
                "url": row["url"],
                "companies": row_companies,
                "topics": row_topics,
                "difficulty": row["difficulty"].lower(),
                "lintcode_equivalent_problem_number": None,
                "lintcode_equivalent_problem_url": None,
            },
        }
    )

companies = list(companies)
topics = list(topics)

companies_res = []
for i, company in enumerate(companies):
    companies_res.append(
        {
            f"{company}": {
                "model": "algofun.company",
                "pk": i + 1,
                "fields": {"name": company},
            }
        }
    )
topics_res = []
for i, topic in enumerate(topics):
    topics_res.append(
        {topic: {"model": "algofun.topic", "pk": i + 1, "fields": {"name": topic}}}
    )

companies_res = [list(item.values())[0] for item in companies_res]
topics_res = [list(item.values())[0] for item in topics_res]

with open("./003sources.json", "w") as jsonFile:
    jsonFile.write(
        json.dumps(
            [
                {
                    "model": "algofun.source",
                    "pk": 1,
                    "fields": {"name": "leetCode"},
                }
            ],
            indent=4,
        )
    )

with open("./001companies.json", "w") as jsonFile:
    jsonFile.write(json.dumps(companies_res, indent=4))
with open("./002topics.json", "w") as jsonFile:
    jsonFile.write(json.dumps(topics_res, indent=4))

for row in res:
    row["fields"]["companies"] = [
        companies.index(company) + 1 for company in row["fields"]["companies"]
    ]
    row["fields"]["topics"] = [
        topics.index(topic) + 1 for topic in row["fields"]["topics"]
    ]

with open("./004problems.json", "w") as jsonFile:
    jsonFile.write(json.dumps(res, indent=4))
