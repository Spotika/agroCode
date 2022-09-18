import cv2




class CustomMap:

    staticPath = "main/static/"
    originalMapPath = "main/img/originalMap.png"
    outputMapPath = "main/img/outputMap.png"
    outputTilePath = "main/img/tiles/z/" # replace z
    tileName = "x-y.png" # replace x, y



    tileSize = 4096
    mapZoom = [4, 5, 6, 7]
    # startD = tileSize / 4

    def __init__(self):
        pass


    def crop_output(self) -> None:
        # zoom = 1
        outputMap = cv2.imread(self.staticPath + self.outputMapPath)
        for zoom in range(len(self.mapZoom)):
            zoomedTile = self.tileSize // (2 ** (zoom + 2))
            for i in range(outputMap.shape[0] // zoomedTile):
                for j in range(outputMap.shape[1] // zoomedTile):
                    # cut file
                    croppedTile = outputMap[i * zoomedTile:(i + 1) * zoomedTile, j * zoomedTile:(j + 1) * zoomedTile]

                    savePath = self.staticPath + self.outputTilePath.replace("z", str(self.mapZoom[zoom])) + self.tileName.replace("x", str(j)).replace("y", str(i))
                    # save file
                    cv2.imwrite(savePath, croppedTile)

