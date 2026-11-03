extends Node3D

## Simple background traffic for the neighborhood slice.
## Vehicles are ambience, not a gameplay system yet.

var vehicles: Array[Node3D] = []
var lanes := [-1.2, 1.2]
var speed := [3.0, 2.4, 3.6, 2.8]

func _ready() -> void:
    for index in 4:
        var car := Node3D.new()
        car.name = "Vehicle_%02d" % (index + 1)
        add_child(car)
        var mesh := MeshInstance3D.new()
        var box := BoxMesh.new()
        box.size = Vector3(1.2, 0.55, 2.2)
        mesh.mesh = box
        mesh.position.y = 0.42
        car.add_child(mesh)
        car.position = Vector3(-18.0 + index * 9.0, 0.0, lanes[index % 2])
        vehicles.append(car)

func _process(delta: float) -> void:
    for index in vehicles.size():
        var car := vehicles[index]
        car.position.x += speed[index] * delta
        if car.position.x > 20.0:
            car.position.x = -20.0
