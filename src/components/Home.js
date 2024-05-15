import Button from "react-bootstrap/Button";
import React, { useCallback, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import { BsTrash, BsX } from "react-icons/bs";
import "reactflow/dist/style.css";

import ModalComponent from "./ModalComponent";
import toast from "react-hot-toast";

const Home = () => {
  const [title, setTitle] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [nodeValue, setNodeValue] = useState({});
  const [showNodeDelete, setShowNodeDelete] = useState(false);
  const [showEdgeDelete, setShowEdgeDelete] = useState(false);
  const [nodeTitles, setNodeTitles] = useState({});
  const [hoveredNodePosition, setHoveredNodePosition] = useState({
    x: 0,
    y: 0,
  });
  const [hoveredEdgePosition, setHoveredEdgePosition] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  ///create Node ------------------------------------------->  '
  const handleCreateNode = () => {
    const newNode = {
      id: Math.random().toString(),
      data: { label: "Node " + (nodes.length + 1) },
      position: { x: Math.random() * 100, y: Math.random() * 100 },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  //hover on Node ------------------->
  const handleNodeMouseEnter = (event, node) => {
    setNodeValue(node);
    setShowNodeDelete(true);
    setHoveredNodePosition({ x: node.position.x, y: node.position.y });
    setHoveredNode(node.id);
    setShowEdgeDelete(false);
  };

  //hover on Edge ------------------>
  const handleEdgeMounseEnter = (event, edge) => {
    setHoveredEdgePosition(edge);
    setShowEdgeDelete(true);
    setHoveredEdge(edge.id);
    setShowNodeDelete(false);
    // setShow(false);
  };

  //Close edge  ---------------------->
  const hanldeCloseEdge = () => {
    setShowEdgeDelete(false);
  };

  //Close Node ------------------->
  const hanldeCloseNode = () => {
    setShowNodeDelete(false);
  };

  //Delete Node --------------------->
  const handleDeleteNode = (nodeId) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setShowNodeDelete(false);
    toast.success("Node deleted successfully");
  };

  //Delete Edge -------------------------------->
  const handleDeleteEdge = (edgeId) => {
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
    setShowEdgeDelete(false);
    toast.success("Branch deleted successfully");
  };

  //for open popup ----------------->
  const [show, setShow] = useState(false);

  const handleNodeClick = (event, node) => {
    setShowNodeDelete(false);
    setShow(true);
    setShowEdgeDelete(false);
  };

  //setting the value to title of node --------------------------->
  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  //click on save button ------------------------------->
  const handleSaveButton = () => {
    if (title.length > 0) {
      setNodeTitles((prev) => ({
        ...prev,
        [nodeValue.id]: title,
      }));
      setTitle("");
      toast.success("Title added successfully");
    }
    setNodeValue({});
  };

  //for style ------------------------------>
  const nodeStyles = {
    display: "flex",
    gap: "5px",
    alignItems: "center",
  };

  //finding edge postion -------------------------------------------------->
  const getSourceNodePosition = (edge) => {
    const sourceNode = nodes.find((element) => element.id === edge.source);
    if (sourceNode) {
      return sourceNode.position;
    }
    return { x: 0, y: 0 }; // Default position
  };

  const getTargetNodePosition = (edge) => {
    const targetNode = nodes.find((element) => element.id === edge.target);
    if (targetNode) {
      return targetNode.position;
    }
    return { x: 0, y: 0 }; // Default position
  };

  const getSourceAndTargetPosition = () => {
    const sourcePosition = getSourceNodePosition(hoveredEdgePosition);
    const targetPosition = getTargetNodePosition(hoveredEdgePosition);
    return {
      x: (sourcePosition.x + targetPosition.x) / 2,
      y: (sourcePosition.y + targetPosition.y) / 2 + 20,
    };
  };

  return (
    <div className="d-flex flex-column">
      <div
        style={{ width: "100vw", height: "100vh" }}
        className="d-flex flex-column"
      >
        <div className="d-flex align-items-center justify-content-start m-3">
          <Button variant="primary" onClick={handleCreateNode}>
            Create node
          </Button>{" "}
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeMouseEnter={handleNodeMouseEnter}
          onNodeClick={handleNodeClick}
          onEdgeMouseEnter={handleEdgeMounseEnter}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
          {nodes.map((node) => (
            <div
              key={node.id}
              style={{
                position: "absolute",
                top: node.position.y - 10,
                left: node.position.x,
              }}
            >
              {nodeTitles[node.id] && <div>{nodeTitles[node.id]}</div>}
            </div>
          ))}
        </ReactFlow>
      </div>

      {showNodeDelete && (
        <>
          <div
            style={{
              position: "absolute",
              top: hoveredNodePosition.y + 40,
              left: hoveredNodePosition?.x,
            }}
          >
            <div style={nodeStyles}>
              <BsTrash
                style={{
                  cursor: "pointer",
                  marginRight: "10px",
                  color: "red",
                  fontSize: "20px",
                }}
                onClick={() => handleDeleteNode(hoveredNode)}
              />
              <BsX
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  border: "1px solid black",
                  borderRadius: "6px",
                }}
                onClick={hanldeCloseNode}
              />
            </div>
          </div>
        </>
      )}

      {showEdgeDelete && (
        <>
          <div
            style={{
              position: "absolute",
              top: getSourceAndTargetPosition()?.y,
              left: getSourceAndTargetPosition()?.x,
            }}
          >
            <div style={nodeStyles}>
              <BsTrash
                style={{
                  cursor: "pointer",
                  marginRight: "10px",
                  color: "red",
                  fontSize: "20px",
                }}
                onClick={() => handleDeleteEdge(hoveredEdge)}
              />
              <BsX
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                  border: "1px solid black",
                  borderRadius: "6px",
                }}
                onClick={hanldeCloseEdge}
              />
            </div>
          </div>
        </>
      )}

      {show && (
        <ModalComponent
          setShow={setShow}
          handleTitle={handleTitle}
          title={title}
          handleSaveButton={handleSaveButton}
        />
      )}
    </div>
  );
};

export default Home;
