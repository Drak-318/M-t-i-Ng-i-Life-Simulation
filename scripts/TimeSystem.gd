extends Node

## Nền tảng thời gian của Life Simulation.
## 1 giây thực = 1 phút trong game ở vertical slice hiện tại.

signal time_changed(day: int, hour: int, minute: int)
signal day_changed(day: int)

@export var start_day := 1
@export var start_hour := 7
@export var start_minute := 42
@export var real_seconds_per_game_minute := 1.0

var day := 1
var hour := 7
var minute := 42
var _accumulator := 0.0

func _ready() -> void:
    day = start_day
    hour = start_hour
    minute = start_minute
    _emit_time()

func _process(delta: float) -> void:
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

func get_total_minutes() -> int:
    return (day - 1) * 1440 + hour * 60 + minute

func get_clock_text() -> String:
    return "%02d:%02d" % [hour, minute]

func get_day_text() -> String:
    var names := ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"]
    return names[(day - 1) % 7]

func _emit_time() -> void:
    time_changed.emit(day, hour, minute)
