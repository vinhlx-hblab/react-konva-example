import React, { useEffect, useState } from "react";
import { Stage, Layer, Line, Text, Image, Shape } from "react-konva";
import "./App.css";
import useImage from "use-image";

const BgImage = () => {
  const [image] = useImage(
    "https://cdn.tgdd.vn/hoi-dap/1369909/200-anh-lam-slide-powerpoint-cuc-dep-chuyen-nghiep-khong%20(3).jpg",
    "anonymous"
  );
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
  const isDrawing = React.useRef(false);
  const stageRef = React.useRef(null);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
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
    <div>
      <div className="position-relative">
        <img
          src="https://cdn.tgdd.vn/hoi-dap/1369909/200-anh-lam-slide-powerpoint-cuc-dep-chuyen-nghiep-khong%20(3).jpg"
          onLoad={onBgImgLoad}
        />
        <Stage
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          style={{
            position: "absolute",
            top: "0",
          }}
          ref={stageRef}
        >
          <Layer>
            <BgImage />
          </Layer>
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="#df4b26"
                strokeWidth={5}
                tension={0.5}
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
      <button
        className="btn btn-primary mt-3"
        onClick={() => {
          const uri = stageRef.current.toDataURL();
          downloadURI(uri, "stage.png");
        }}
      >
        Export
      </button>
    </div>
  );
}

export default App;
