
// playing around with query params
router.get('/shopping', (req, res) => {
    /// some stuff with boots
    const bootType = req.query.bootType;
    const color = req.query.color;
    const size = req.query.size;

    res.send(`you want ${color} ${bootType}s in size ${size}`);
})



// playing around with accessing items in objects
const foods = [
    { foodId: 1, food: 'Chicken Noodle' },
    { foodId: 2, food: 'Chicken Satay' },
    { foodId: 3, food: 'Idaho Potato' },
    { foodId: 4, food: 'Pumpkin Pie Biryani' },
    { foodId: 5, food: 'Vegan Portland Chicken' },
    { foodId: 6, food: 'Nasi Lemak' },
    { foodId: 7, food: 'Bowl of Shit' },
    { foodId: 8, food: 'Lamb Biryani' },
    { foodId: 9, food: 'Rhubarb Pie' },
    { foodId: 99, food: 'Chocolate Chocolate' },
]

//route parameters: name and color, then a favorite food from the array
router.get("/hello/:name/:color/:foodId", function (req, res, next) {
    let foodId = (req.params.foodId);

    const foodName = ''; //todo
    res.send(`Hello ${req.params.name}. Your favorite color is ${req.params.color}. Your favrotie food is ${foodId}`);
})




