extends RefCounted

## Data-driven profile for important NPCs.
## The character owns a life outside the player's interaction.

var id := ""
var display_name := ""
var age := 24
var occupation := ""
var home_location := ""
var personality: Dictionary = {}
var needs: Dictionary = {}
var boundaries: Array[String] = []
var communication_style: Dictionary = {}
var goals: Array[String] = []
var schedule: Dictionary = {}
var mood := "calm"
var emotional_availability := 0.65
var energy := 80.0
var workload := 20.0
var family_pressure := 10.0
var social_energy := 60.0

func setup(data: Dictionary) -> void:
    id = str(data.get("id", ""))
    display_name = str(data.get("display_name", ""))
    age = int(data.get("age", 24))
    occupation = str(data.get("occupation", ""))
    home_location = str(data.get("home_location", "HOME"))
    personality = data.get("personality", {}).duplicate(true)
    needs = data.get("needs", {}).duplicate(true)
    boundaries = Array(data.get("boundaries", [])).duplicate()
    communication_style = data.get("communication_style", {}).duplicate(true)
    goals = Array(data.get("goals", [])).duplicate()
    schedule = data.get("schedule", {}).duplicate(true)
    mood = str(data.get("mood", "calm"))
    emotional_availability = float(data.get("emotional_availability", 0.65))
    energy = float(data.get("energy", 80.0))
    workload = float(data.get("workload", 20.0))
    family_pressure = float(data.get("family_pressure", 10.0))
    social_energy = float(data.get("social_energy", 60.0))

func schedule_location(day: int, hour: int) -> String:
    var day_key := str(day)
    if not schedule.has(day_key):
        return home_location
    var entries: Array = schedule[day_key]
    for entry in entries:
        if hour >= int(entry.get("from", 0)) and hour < int(entry.get("to", 24)):
            return str(entry.get("location", home_location))
    return home_location

func tick(delta_minutes: int) -> void:
    energy = clamp(energy - delta_minutes * 0.015, 0.0, 100.0)
    social_energy = clamp(social_energy + (0.5 if mood == "calm" else -0.15) * delta_minutes * 0.01, 0.0, 100.0)
    emotional_availability = clamp((energy * 0.006 + social_energy * 0.004 + (100.0 - family_pressure) * 0.002), 0.0, 1.0)

func to_dict() -> Dictionary:
    return {
        "id": id,
        "display_name": display_name,
        "age": age,
        "occupation": occupation,
        "home_location": home_location,
        "personality": personality,
        "needs": needs,
        "boundaries": boundaries,
        "communication_style": communication_style,
        "goals": goals,
        "schedule": schedule,
        "mood": mood,
        "emotional_availability": emotional_availability,
        "energy": energy,
        "workload": workload,
        "family_pressure": family_pressure,
        "social_energy": social_energy
    }
