var points = [];

function upl ()
{
    
    $.ajax({
        url: POSTurl,
        type: 'post',
        data: {
            points: points,
            csrfmiddlewaretoken: CSRF_TOKEN,
        },})
}

ymaps.ready(function () {
    var LAYER_NAME = 'main#layer',
        MAP_TYPE_NAME = 'main#customMap',
    // Директория с тайлами.
        TILES_PATH = tilePath,
    /* Для того чтобы вычислить координаты левого нижнего и правого верхнего углов прямоугольной координатной
     * области, нам необходимо знать максимальный зум, ширину и высоту изображения в пикселях на максимальном зуме.
     */
        // TODO: не менять эти параметры, они связаны с main/methods.py
        MAX_ZOOM = 8,
        PIC_WIDTH = 256 * 16 * 4;
        PIC_HEIGHT = 256 * 16 * 4; 


    /**
     * Конструктор, создающий собственный слой.
     */
    var Layer = function () {
        var layer = new ymaps.Layer(TILES_PATH + '%z/%x-%y.png', {
            // Если есть необходимость показать собственное изображение в местах неподгрузившихся тайлов,
            // раскомментируйте эту строчку и укажите ссылку на изображение.
            // notFoundTile: 'url'
        });
        // Указываем доступный диапазон масштабов для данного слоя.
        layer.getZoomRange = function () {
            return ymaps.vow.resolve([0, 7]);
        };
        return layer;
    };
    // Добавляем в хранилище слоев свой конструктор.
    ymaps.layer.storage.add(LAYER_NAME, Layer);

    /**
     * Создадим новый тип карты.
     * MAP_TYPE_NAME - имя нового типа.
     * LAYER_NAME - ключ в хранилище слоев или функция конструктор.
     */
    var mapType = new ymaps.MapType(MAP_TYPE_NAME, [LAYER_NAME]);
    // Сохраняем тип в хранилище типов.
    ymaps.mapType.storage.add(MAP_TYPE_NAME, mapType);

    // Вычисляем размер всех тайлов на максимальном зуме.
    var worldSize = Math.pow(2, MAX_ZOOM) * 256,
        /**
         * Создаем карту, указав свой новый тип карты.
         */
        map = new ymaps.Map('map', {
            center: [0, 0],
            zoom: 4,
            controls: ['zoomControl'],
            type: MAP_TYPE_NAME
        }, {

            // // Задаем в качестве проекции Декартову. При данном расчёте центр изображения будет лежать в координатах [0, 0].
            // projection: new ymaps.projection.Cartesian([[PIC_HEIGHT / 2 - worldSize, -PIC_WIDTH / 2], [PIC_HEIGHT / 2, worldSize - PIC_WIDTH / 2]], [false, false]),
            // // Устанавливаем область просмотра карты так, чтобы пользователь не смог выйти за пределы изображения.
            // restrictMapArea: [[-PIC_HEIGHT / 2, -PIC_WIDTH / 2], [PIC_HEIGHT / 2, PIC_WIDTH / 2]]

            // При данном расчёте, в координатах [0, 0] будет находиться левый нижний угол изображения,
            // правый верхний будет находиться в координатах [PIC_HEIGHT, PIC_WIDTH].
            projection: new ymaps.projection.Cartesian([[PIC_HEIGHT - worldSize, 0], [PIC_HEIGHT, worldSize]], [false, false]),
            restrictMapArea: [[0, 0], [PIC_HEIGHT, PIC_WIDTH]],
        });








    // END OFF CREATING MAP
    var xStep = 310050;
    var yStep = 4800050;
    // objectManager = new ymaps.ObjectManager({
    //     // Чтобы метки начали кластеризоваться, выставляем опцию.
    //     clusterize: true,
    //     // ObjectManager принимает те же опции, что и кластеризатор.
    //     gridSize: 32,
    //     clusterDisableClickZoom: true
    // });
    // objectManager.objects.options.set('preset', 'islands#greenDotIcon', );
    // objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    // map.geoObjects.add(objectManager);
    // $.ajax({
    //     url: geoJsonPath
    // }).done(function(data) {
    //     // console.log(data);
    //     objectManager.add(data);
    // });
    // objectManager = new ymaps.ObjectManager();
    // Загружаем GeoJSON файл, экспортированный из Конструктора карт.
    $.getJSON(geoJsonPath)
        .done(function (geoJson) {

            geoJson.features.forEach(function (obj) {
                // Задаём контент балуна.
                // Задаём пресет для меток с полем iconCaption.
                var x = obj.geometry.coordinates[0];
                var y = obj.geometry.coordinates[1];
                y = PIC_HEIGHT - (4096 - ((y - yStep) / 100)) * 4;
                x = ((x - xStep) / 100) * 4
                // objectManager.add(obj.geometry);
                map.geoObjects.add(new ymaps.Placemark([y, x], 
                    {
                        id: obj.properties.n,
                    },
                    {
                        preset: 'islands#icon',
                    }
                    ));
                });
                
                
                map.geoObjects.each(function (geoObject) {
                    geoObject.events.add(['click'], 
                    function (e) 
                    {
                        if (geoObject.options.get('preset') == 'islands#icon')
                        {
                            geoObject.options.set({
                                preset: 'islands#greenDotIcon'
                            });
                            points.push(geoObject.properties.get('id'));
                        }
                    else
                    {
                        geoObject.options.set({
                            preset: 'islands#icon'
                        });
                        var myIndex = points.indexOf(geoObject.properties.get('id'));
                        if (myIndex !== -1) {
                            points.splice(myIndex, 1);
                        }
                    }
                    
                }
                );
            });
            //         objectManager.objects.add(geoJson);
            //         // Добавляем описание объектов в формате JSON в менеджер объектов.
            //         // Добавляем объекты на карту.
            //         // console.log(objectManager);
            //         map.geoObjects.add(objectManager);
        });
        
        
        
        // function onObjectEvent (e) {
            //     console.log(e);
            //     var objectId = e.get('objectId');
            //     if (e.get('type') == 'mouseenter') {
                //         // Метод setObjectOptions позволяет задавать опции объекта "на лету".
                //         objectManager.objects.setObjectOptions(objectId, {
                    //             preset: 'islands#yellowIcon'
                    //         });
                    //     } else {
                        //         objectManager.objects.setObjectOptions(objectId, {
                            //             preset: 'islands#blueIcon'
                            //         });
                            //     }
                            // }
                            
                            //     var point = new ymaps.Placemark([16384 - 2028 * 4,244 * 4],
                            //         {
                                //             balloonContent: "Hello",
    //         },
    //         {
    //             draggable: true,
    //             preset: 'islands#darkOrangeDotIcon',
    //         }
    //         );
    //     map.geoObjects.add(point);
    // var placemark = new ymaps.Placemark([0, 0], {
    //     balloonContent: 'Координаты метки: [0, 0]'
    // }, {
    //     preset: 'islands#darkOrangeDotIcon'
    // });


    // // Добавляет метку на карту
    // map.geoObjects.add(placemark);
    // objectManager.objects.events.add(['mouseenter', 'mouseleave', 'click'], onObjectEvent);

});
