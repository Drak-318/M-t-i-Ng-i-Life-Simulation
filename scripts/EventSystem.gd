extends Node

## Data-driven story engine for the MVP.
## Scenes are selected from state, time, location, memory and relationship context.

signal scene_started(scene: Dictionary)
signal scene_finished(scene_id: String)

var state_manager: Node
var memory_manager: Node
var relationship_manager: Node
var time_system: Node
var current_scene: Dictionary = {}
var completed: Dictionary = {}
var delayed: Array[Dictionary] = []
var rng := RandomNumberGenerator.new()

var scenes: Array[Dictionary] = [
    {"id":"morning_home","title":"Một sáng Chủ nhật","location":"HOME","from":7,"to":10,"priority":10,"text":"Căn phòng vẫn yên. Minh có cả ngày trước mặt, nhưng không có kế hoạch rõ ràng.","choices":[{"text":"Ở nhà thêm một lúc","effects":{"energy":2,"stress":-1},"memory":"chose_to_stay_home"},{"text":"Ra ngoài đi dạo","effects":{"energy":-2,"social_energy":2},"memory":"chose_to_go_out"},{"text":"Tìm một quán cà phê","effects":{"energy":-2,"confidence":1},"memory":"looked_for_cafe"}]},
    {"id":"cafe_quiet","title":"Một người quen ở quán cà phê","location":"CAFE","from":8,"to":12,"priority":12,"text":"Có một người ngồi gần cửa sổ. Minh đã từng thấy cô ấy vài lần trong khu phố.","choices":[{"text":"Chào một câu","effects":{"confidence":2},"relationship":{"affection":2,"understanding":1},"memory":"said_hello"},{"text":"Không làm phiền","effects":{"confidence":-1},"memory":"chose_not_to_approach"},{"text":"Ngồi gần nhưng không nói gì","effects":{"social_energy":-1},"relationship":{"understanding":1},"memory":"sat_nearby"}]},
    {"id":"cafe_second_chance","title":"Lần gặp thứ hai","location":"CAFE","from":12,"to":18,"priority":14,"text":"Cô ấy nhận ra Minh. Lần này, ánh mắt dừng lại lâu hơn một chút.","choices":[{"text":"Hỏi xem cô ấy đang đọc gì","effects":{"confidence":1},"relationship":{"affection":3,"understanding":2},"memory":"asked_about_book"},{"text":"Chỉ mỉm cười","effects":{"confidence":1},"relationship":{"affection":1},"memory":"smiled"},{"text":"Rời đi để cô ấy có không gian","effects":{"social_energy":1},"relationship":{"respect":2},"memory":"gave_space"}]},
    {"id":"store_small_talk","title":"Cuộc nói chuyện rất ngắn","location":"STORE","from":9,"to":21,"priority":8,"text":"Một cuộc gặp tình cờ. Chẳng có gì đặc biệt, cho đến khi một câu nói nhỏ khiến Minh nhớ cả ngày.","choices":[{"text":"Ở lại nói chuyện","effects":{"energy":-1,"social_energy":-1},"relationship":{"understanding":2},"memory":"stayed_for_small_talk"},{"text":"Chào rồi đi","effects":{"energy":0},"relationship":{"respect":1},"memory":"brief_greeting"}]},
    {"id":"park_walk","title":"Một vòng quanh công viên","location":"PARK","from":7,"to":20,"priority":7,"text":"Buổi chiều dịu hơn. Có những chuyện chỉ trở nên rõ ràng khi mình đi bộ đủ lâu.","choices":[{"text":"Đi một mình","effects":{"stress":-2,"energy":-2},"memory":"walked_alone"},{"text":"Nếu gặp cô ấy thì chào","effects":{"confidence":1},"memory":"open_to_meeting"}]},
    {"id":"work_monday","title":"Thứ Hai trở lại","location":"OFFICE","from":8,"to":18,"priority":15,"text":"Màn hình sáng lên. Những việc của tuần trước vẫn còn đó.","choices":[{"text":"Làm từng việc một","effects":{"stress":-1,"work_pressure":-3},"memory":"worked_steadily"},{"text":"Cố làm thật nhanh","effects":{"energy":-3,"stress":2,"work_pressure":-4},"memory":"worked_fast"},{"text":"Tranh thủ nhắn tin cho một người quen","effects":{"energy":-1,"work_pressure":1},"relationship":{"affection":1},"memory":"sent_message_at_work"}]},
    {"id":"monday_evening","title":"Sau giờ làm","location":"CAFE","from":18,"to":22,"priority":10,"text":"Sau một ngày dài, một cuộc gặp ngắn cũng có thể khiến buổi tối khác đi.","choices":[{"text":"Ở lại một lát","effects":{"energy":-2,"stress":-1},"relationship":{"closeness":2,"affection":2},"memory":"stayed_after_work"},{"text":"Về nhà nghỉ","effects":{"energy":3,"stress":-2},"memory":"went_home_to_rest"}]},
    {"id":"midweek_message","title":"Một tin nhắn bất ngờ","location":"HOME","from":19,"to":23,"priority":13,"text":"Điện thoại sáng lên. Không phải tin nhắn dài. Chỉ là một câu hỏi bình thường.","choices":[{"text":"Trả lời ngay","effects":{"social_energy":-1},"relationship":{"trust":2,"affection":1},"memory":"replied_quickly"},{"text":"Để lát nữa trả lời","effects":{"stress":1},"relationship":{"trust":-1},"memory":"delayed_reply"},{"text":"Hỏi lại xem có chuyện gì","effects":{"confidence":1},"relationship":{"understanding":2},"memory":"asked_whats_up"}]},
    {"id":"friday_pressure","title":"Một tuần đã dài hơn dự kiến","location":"OFFICE","from":16,"to":21,"priority":16,"text":"Minh mệt. Có một lời rủ đi ăn tối, nhưng cũng có một đống việc chưa xong.","choices":[{"text":"Đi ăn","effects":{"energy":-2,"stress":-3},"relationship":{"closeness":3,"affection":2},"memory":"chose_people_over_work"},{"text":"Ở lại làm","effects":{"energy":-4,"stress":3,"work_pressure":-5},"memory":"chose_work_over_social"}]},
    {"id":"weekend_reflection","title":"Một tuần nhìn lại","location":"HOME","from":8,"to":23,"priority":18,"text":"Một tuần trôi qua không có biến cố lớn. Nhưng Minh nhận ra mình đã bắt đầu để ý đến một người.","choices":[{"text":"Chủ động hẹn một buổi cà phê","effects":{"confidence":2},"relationship":{"affection":4,"willingness_to_continue":2},"memory":"proposed_coffee","delayed":"coffee_invitation_result"},{"text":"Để mọi thứ tự nhiên","effects":{"stress":-1},"relationship":{"respect":1},"memory":"let_things_flow"},{"text":"Tập trung vào cuộc sống của mình","effects":{"confidence":2,"energy":2},"memory":"focused_on_self"}]},
    {"id":"quiet_night","title":"Đêm yên","location":"HOME","from":22,"to":24,"priority":5,"text":"Không phải ngày nào cũng cần một kết luận.","choices":[{"text":"Xem phim","effects":{"stress":-2,"energy":1},"memory":"watched_movie"},{"text":"Ngủ sớm","effects":{"energy":5,"stress":-2},"memory":"slept_early"}]}
]

func setup(state: Node, memory: Node, relationship: Node, clock: Node) -> void:
    state_manager = state
    memory_manager = memory
    relationship_manager = relationship
    time_system = clock
    rng.randomize()

func request_scene(location_id: String) -> Dictionary:
    var hour := time_system.get_hour()
    var candidates: Array[Dictionary] = []
    for scene in scenes:
        if str(scene.get("location", "")) != location_id:
            continue
        if hour < int(scene.get("from", 0)) or hour >= int(scene.get("to", 24)):
            continue
        if completed.has(str(scene.get("id", ""))):
            continue
        if not _conditions_pass(scene):
            continue
        candidates.append(scene)
    if candidates.is_empty():
        return {}
    candidates.sort_custom(func(a: Dictionary, b: Dictionary) -> bool:
        return int(a.get("priority", 0)) > int(b.get("priority", 0))
    )
    current_scene = candidates[0]
    scene_started.emit(current_scene)
    return current_scene

func choose(index: int) -> Dictionary:
    if current_scene.is_empty():
        return {}
    var choices: Array = current_scene.get("choices", [])
    if index < 0 or index >= choices.size():
        return {}
    var choice: Dictionary = choices[index]
    for key in choice.get("effects", {}).keys():
        state_manager.change_value(str(key), float(choice["effects"][key]))
    var relationship_effects: Dictionary = choice.get("relationship", {})
    if not relationship_effects.is_empty():
        relationship_manager.apply_changes("LINH", relationship_effects)
    var memory_id := str(choice.get("memory", ""))
    if not memory_id.is_empty():
        memory_manager.remember(memory_id, "scene:%s" % current_scene.get("id", ""), time_system.get_total_minutes(), 0.45, ["story", str(current_scene.get("id", ""))])
    var delayed_id := str(choice.get("delayed", ""))
    if not delayed_id.is_empty():
        delayed.append({"id":delayed_id,"due":time_system.get_total_minutes()+720,"source":current_scene.get("id","")})
    var scene_id := str(current_scene.get("id", ""))
    completed[scene_id] = true
    scene_finished.emit(scene_id)
    var result := {"scene_id":scene_id,"choice":choice,"text":str(choice.get("text", ""))}
    current_scene = {}
    return result

func _conditions_pass(scene: Dictionary) -> bool:
    var id := str(scene.get("id", ""))
    if id == "cafe_second_chance" and not memory_manager.has_memory("said_hello") and not memory_manager.has_memory("sat_nearby"):
        return false
    if id == "midweek_message" and relationship_manager.get_value("LINH", "affection") < 2.0:
        return false
    if id == "weekend_reflection" and time_system.get_day() < 7:
        return false
    return true

func tick_delayed() -> Array[Dictionary]:
    var now := time_system.get_total_minutes()
    var triggered: Array[Dictionary] = []
    var remaining: Array[Dictionary] = []
    for item in delayed:
        if now >= int(item.get("due", 0)):
            triggered.append(item)
        else:
            remaining.append(item)
    delayed = remaining
    return triggered

func snapshot() -> Dictionary:
    return {"completed":completed.duplicate(true),"delayed":delayed.duplicate(true)}

func restore(data: Dictionary) -> void:
    completed = data.get("completed", {}).duplicate(true)
    delayed = data.get("delayed", []).duplicate(true)
