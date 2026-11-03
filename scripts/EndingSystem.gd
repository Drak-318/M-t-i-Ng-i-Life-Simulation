extends Node

## End-of-week state evaluation. No Good/Bad label is used.

func evaluate(state_manager: Node, relationship_manager: Node, memory_manager: Node) -> Dictionary:
    var affection := relationship_manager.get_value("LINH", "affection")
    var trust := relationship_manager.get_value("LINH", "trust")
    var closeness := relationship_manager.get_value("LINH", "closeness")
    var respect := relationship_manager.get_value("LINH", "respect")
    var compatibility := relationship_manager.get_value("LINH", "compatibility")
    var confidence := float(state_manager.get_value("confidence", 50.0))
    var stress := float(state_manager.get_value("stress", 20.0))
    var energy := float(state_manager.get_value("energy", 50.0))

    if affection >= 8.0 and trust >= 4.0 and closeness >= 5.0:
        return {"id":"connection_begins","title":"Một kết nối bắt đầu","text":"Không ai gọi tên mối quan hệ này. Nhưng cả hai đã bắt đầu dành cho nhau một phần thời gian mà trước đây không có.","tone":"open"}
    if affection >= 6.0 and respect >= 3.0 and confidence >= 55.0:
        return {"id":"slow_but_real","title":"Chậm, nhưng có thật","text":"Minh không làm điều gì lớn lao. Chỉ là cậu đã bắt đầu chủ động hơn một chút, và thế giới đáp lại bằng một khoảng cách ngắn hơn.","tone":"open"}
    if trust >= 5.0 and affection < 6.0:
        return {"id":"quiet_friendship","title":"Một tình bạn yên","text":"Hai người hiểu nhau hơn trước. Không phải mọi sự gần gũi đều phải trở thành tình yêu.","tone":"friendship"}
    if stress >= 60.0 and energy <= 35.0:
        return {"id":"life_needs_space","title":"Cuộc sống cần một khoảng thở","text":"Tuần này không thất bại. Minh chỉ nhận ra mình đã cố gắng quá nhiều cho những thứ chưa cần phải giải quyết ngay.","tone":"self"}
    if compatibility < 35.0:
        return {"id":"different_rhythm","title":"Hai nhịp sống khác nhau","text":"Có thiện cảm không có nghĩa là hai người luôn đi cùng một nhịp. Minh bắt đầu hiểu điều đó.","tone":"distance"}
    if memory_manager.has_memory("focused_on_self") and confidence >= 55.0:
        return {"id":"life_continues","title":"Cuộc sống vẫn tiếp tục","text":"Minh chưa tìm được câu trả lời cho chuyện của hai người. Nhưng cậu đã tìm lại được nhịp sống của mình.","tone":"self"}
    return {"id":"nothing_decided","title":"Chưa có gì được quyết định","text":"Một tuần trôi qua. Không có câu trả lời rõ ràng. Và có lẽ đó cũng là một phần rất bình thường của cuộc sống.","tone":"open"}
