extends Node

## First production pass for work, money and daily-life pressure.
## Values remain descriptive; they are not a score screen.

signal daily_summary(text: String)

var state_manager: Node
var time_system: Node
var last_processed_day := 0
var monthly_income := 15000000.0
var daily_living_cost := 180000.0
var workday_minutes := 0

func setup(state: Node, clock: Node) -> void:
    state_manager = state
    time_system = clock
    last_processed_day = time_system.get_day()

func _process(_delta: float) -> void:
    if time_system == null or state_manager == null:
        return
    var current_day := time_system.get_day()
    if current_day != last_processed_day:
        _process_new_day(last_processed_day)
        last_processed_day = current_day

func _process_new_day(previous_day: int) -> void:
    var weekday := (previous_day - 1) % 7
    var is_workday := weekday >= 1 and weekday <= 5
    state_manager.change_value("money", -daily_living_cost)
    state_manager.change_value("stress", 1.0 if is_workday else -1.0)
    if is_workday:
        workday_minutes += 480
    if weekday == 5:
        state_manager.change_value("money", monthly_income / 22.0)
        state_manager.change_value("work_pressure", -2.0)
        daily_summary.emit("Lương tháng đã được tính vào dòng tiền. Một phần tiền cũng vừa rời khỏi tài khoản cho những chi phí thường ngày.")
    else:
        daily_summary.emit("Một ngày mới bắt đầu. Tiền bạc, công việc và năng lượng tiếp tục vận động dù Minh không chủ động nghĩ về chúng.")
