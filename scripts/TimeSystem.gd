extends Node

signal time_changed(day: int, hour: int, minute: int)
signal day_changed(day: int)

@export var start_day := 1
@export var start_hour := 7
@export var start_minute := 42
@export var real_seconds_per_game_minute := 1.0

var day := 1
var hour := 7
var minute := 42
var paused := false
var _accumulator := 0.0

func _ready() -> void:
    day = start_day
    hour = start_hour
    minute = start_minute
    _emit_time()

func _process(delta: float) -> void:
    if paused:
        return
    _accumulator += delta
    while _accumulator >= real_seconds_per_game_minute:
        _accumulator -= real_seconds_per_game_minute
        advance_minutes(1)

func advance_minutes(amount: int) -> void:
    if amount <= 0:
        return
    var old_day := day
    var total := hour * 60 + minute + amount
    day += int(total / 1440)
    total = total % 1440
    hour = int(total / 60)
    minute = total % 60
    if day != old_day:
        day_changed.emit(day)
    _emit_time()

func set_paused(value: bool) -> void:
    paused = value
    _accumulator = 0.0

func get_total_minutes() -> int:
    return (day - 1) * 1440 + hour * 60 + minute

func get_day() -> int:
    return day

func get_hour() -> int:
    return hour

func get_minute() -> int:
    return minute

func get_clock_text() -> String:
    return "%02d:%02d" % [hour, minute]

func get_day_text() -> String:
    var names := ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"]
    return names[(day - 1) % 7]

func snapshot() -> Dictionary:
    return {"day":day,"hour":hour,"minute":minute,"paused":paused}

func restore(data: Dictionary) -> void:
    day = int(data.get("day", start_day))
    hour = int(data.get("hour", start_hour))
    minute = int(data.get("minute", start_minute))
    paused = bool(data.get("paused", false))
    _accumulator = 0.0
    _emit_time()

func _emit_time() -> void:
    time_changed.emit(day, hour, minute)
