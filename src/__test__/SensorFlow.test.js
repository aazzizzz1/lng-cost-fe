// SensorFlow.test.js
  import { render, screen, fireEvent } from "@testing-library/react";
  import SensorFlow from "../Pages/Sensor/SensorFlow";
  import { ReactFlowProvider } from "@xyflow/react";
  
  // Mocking icons used in SensorFlow component
  jest.mock("../Assets/Svg/Layout/SpeedSensorIcon.jsx", () => () => <div>SpeedSensorIcon</div>);
  jest.mock("../Assets/Svg/Layout/BarometerSensorIcon", () => () => <div>BarometerSensorIcon</div>);
  jest.mock("../Assets/Svg/Layout/DeepthSensorIcon", () => () => <div>DeepthSensorIcon</div>);
  jest.mock("../Assets/Svg/Layout/GyroscopeSensorIcon", () => () => <div>GyroscopeSensorIcon</div>);
  
  describe("SensorFlow Component", () => {
      render(
        <ReactFlowProvider>
          <SensorFlow />
        </ReactFlowProvider>
      );
  
    // Test 1: Check if nodes and their icons are rendered
    test("renders SensorFlow with nodes and icons", () => {
      const nodesAndIcons = [
        { label: "Matrix 1", icon: "GyroscopeSensorIcon" },
        { label: "Matrix 2", icon: "DeepthSensorIcon" },
        { label: "Matrix 3", icon: "BarometerSensorIcon" },
        { label: "Matrix 4", icon: "SpeedSensorIcon" },
      ];
  
      nodesAndIcons.forEach(({ label, icon }) => {
        expect(screen.getByText(label)).toBeInTheDocument();
        expect(screen.getByText(icon)).toBeInTheDocument();
      });
    });
  
    // Test 2: Check if filtering and adding edges works
    test("adds a new edge when nodes are connected", () => {
      // Check initial edges count (assume 3 edges initially)
      const initialEdges = screen.getAllByText("connected");
      expect(initialEdges.length).toBe(3);
  
      // Simulate node click and connection
      fireEvent.click(screen.getByText("Matrix 2"));
      
      // After adding new edge, check the updated edges count
      const updatedEdges = screen.getAllByText("connected");
      expect(updatedEdges.length).toBe(4);
    });
  
    // Test 3: Add more specific interaction checks
    test("filters nodes by name", () => {
      const searchInput = screen.getByPlaceholderText("Search by name");
      fireEvent.change(searchInput, { target: { value: "Matrix 2" } });
  
      // Check if the correct filtered node is displayed
      expect(screen.getByText("Matrix 2")).toBeInTheDocument();
      expect(screen.queryByText("Matrix 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Matrix 3")).not.toBeInTheDocument();
      expect(screen.queryByText("Matrix 4")).not.toBeInTheDocument();
    });
  });
  