import React from "react";
import { Stage, Layer, Line, Image } from "react-konva";
import "./App.css";
import useImage from "use-image";

const BgImage = ({ imageURL }) => {
  const [image] = useImage(imageURL, "anonymous");
  return <Image image={image} />;
};

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function App() {
  const [tool, setTool] = React.useState("pen");
  const [lines, setLines] = React.useState([]);
  const [strokeWidth, setStrokeWidth] = React.useState(1);
  const [strokeColor, setStrokeColor] = React.useState("#000000");
  const [imageURL, setImageURL] = React.useState("");
  const [showDrawContainer, setShowDrawContainer] = React.useState(false);
  const isDrawing = React.useRef(false);
  const stageRef = React.useRef(null);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([
      ...lines,
      { tool, points: [pos.x, pos.y], strokeWidth, strokeColor },
    ]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };
  const onBgImgLoad = ({ target: img }) => {
    const { offsetHeight, offsetWidth } = img;
    stageRef.current.width(offsetWidth);
    stageRef.current.height(offsetHeight);
  };

  return (
    <div className="container py-5">
      {!showDrawContainer && (
        <div className="mb-3">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter a image url"
            onChange={(e) => setImageURL(e.target.value)}
          />
          <div>
            <button
              onClick={() => {
                setShowDrawContainer(true);
              }}
              className="btn btn-primary"
              disabled={!imageURL}
            >
              Draw
            </button>
            <button
              onClick={() => {
                setImageURL(
                  "https://cdn.tgdd.vn/hoi-dap/1369909/200-anh-lam-slide-powerpoint-cuc-dep-chuyen-nghiep-khong%20(3).jpg"
                );
                setShowDrawContainer(true);
              }}
              className="btn btn-primary ms-2"
            >
              Use URL example
            </button>
          </div>
        </div>
      )}
      {showDrawContainer && (
        <div className="row">
          <div className="tool-container col-3">
            <div className="mb-3">
              <select
                value={tool}
                onChange={(e) => {
                  setTool(e.target.value);
                }}
                className="form-control w-25"
              >
                <option value="pen">Pen</option>
                <option value="eraser">Eraser</option>
              </select>
            </div>
            <div className="mb-3">
              <input
                id="size"
                type="range"
                min="0.5"
                max="100"
                value={strokeWidth}
                step="0.1"
                onChange={(e) => {
                  const { value } = e.target;
                  setStrokeWidth(value);
                }}
              />
            </div>
            <div className="mb-3">
              <input
                id="color"
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <button
                className="btn btn-primary"
                onClick={() => {
                  const uri = stageRef.current.toDataURL();
                  downloadURI(uri, "stage.png");
                }}
              >
                Export
              </button>
            </div>
          </div>
          <div className="position-relative col-9">
            <img src={imageURL} onLoad={onBgImgLoad} />
            <Stage
              onMouseDown={handleMouseDown}
              onMousemove={handleMouseMove}
              onMouseup={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              onTouchMove={handleMouseMove}
              style={{
                position: "absolute",
                top: "0",
                cursor: "crosshair",
              }}
              ref={stageRef}
            >
              <Layer>
                <BgImage imageURL={imageURL} />
              </Layer>
              <Layer>
                {lines.map((line, i) => (
                  <Line
                    key={i}
                    points={line.points}
                    stroke={line.strokeColor}
                    strokeWidth={line.strokeWidth}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={
                      line.tool === "eraser" ? "destination-out" : "source-over"
                    }
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
