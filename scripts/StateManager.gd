extends Node

## Quản lý state chung của người chơi.
## Không biến state thành điểm thắng/thua; state chỉ mô tả tình trạng cuộc sống.

signal state_changed(key: String, value: Variant)

var values := {
    "energy": 82.0,
    "money": 15000000.0,
    "stress": 18.0,
    "confidence": 52.0,
    "social_energy": 55.0,
    "work_pressure": 20.0
}

func get_value(key: String, fallback: Variant = null) -> Variant:
    return values.get(key, fallback)

func set_value(key: String, value: Variant) -> void:
    values[key] = value
    state_changed.emit(key, value)

func change_value(key: String, amount: float) -> void:
    var current := float(values.get(key, 0.0))
    set_value(key, current + amount)

func snapshot() -> Dictionary:
    return values.duplicate(true)

func restore(snapshot_data: Dictionary) -> void:
    values = snapshot_data.duplicate(true)
    for key in values:
        state_changed.emit(key, values[key])
