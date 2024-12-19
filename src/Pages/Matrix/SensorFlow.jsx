import React, { useCallback } from "react";
import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";
import SpeedSensorIcon from "../../Assets/Svg/Layout/SpeedSensorIcon";
import BarometerSensorIcon from "../../Assets/Svg/Layout/BarometerSensorIcon";
import DeepthSensorIcon from "../../Assets/Svg/Layout/DeepthSensorIcon";
import GyroscopeSensorIcon from "../../Assets/Svg/Layout/GyroscopeSensorIcon";

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes = [
  {
    id: "1",
    type: "custom",
    data: {
      label: "Matrix 1",
      sensor: "Gyro",
      job: "CEO",
      emoji: <GyroscopeSensorIcon />,
    },
    position: { x: 250, y: 5 },
  },
  {
    id: "2",
    type: "custom",
    data: {
      label: "Matrix 2",
      sensor: "Depth",
      job: "CEO",
      emoji: <DeepthSensorIcon />,
    },
    position: { x: 100, y: 150 },
  },
  {
    id: "3",
    type: "custom",
    data: {
      label: "Matrix 3",
      sensor: "Barometer",
      job: "Designer",
      emoji: <BarometerSensorIcon />,
    },
    position: { x: 400, y: 150 },
  },
  {
    id: "4",
    type: "custom",
    data: {
      label: "Matrix 4",
      sensor: "Speed",
      job: "Developer",
      emoji: <SpeedSensorIcon />,
    },
    position: { x: 250, y: 300 },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", label: "connected", animated: true },
  { id: "e1-3", source: "1", target: "3", label: "connected", animated: true },
  { id: "e3-4", source: "3", target: "4", label: "connected", animated: true },
];

const SensorFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes); // Hapus setNodes yang tidak terpakai
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    [setEdges] // Tambahkan setEdges ke dependencies
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      className="dark:bg-gray-900"
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default SensorFlow;
