ymaps.ready(init);

function init() {
    myMap = new ymaps.Map(
        "map",
        {
            center: [0, 0],
            zoom: 1,
        }
    );

}