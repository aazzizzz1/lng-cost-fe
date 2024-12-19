import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

// Komponen untuk menampilkan pesan layar penuh dengan tombol aksi
const FullScreenMessage = ({ message, buttons }) => (
  <div className="absolute inset-0 flex flex-col justify-center items-center bg-white text-center p-8">
    <p className="mb-4 text-black">{message}</p>
    <div>{buttons}</div>
  </div>
);

const SelfTestDisplay = () => {
  const [step, setStep] = useState("display");
  const [popupMessage, setPopupMessage] = useState(null);
  const [rgbColor, setRgbColor] = useState("rgb(255, 0, 0)");
  const [boxes, setBoxes] = useState([
    { id: 1, moved: false },
    { id: 2, moved: false },
    { id: 3, moved: false },
  ]);
  const [draggedBox, setDraggedBox] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (step === "display") {
      const rgbSequence = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)"];
      let index = 0;
      const interval = setInterval(() => {
        setRgbColor(rgbSequence[index]);
        index = (index + 1) % rgbSequence.length;
      }, 750);

      const timeout = setTimeout(() => {
        setPopupMessage("Apakah display lcd berwarna normal? Yes/No");
        clearInterval(interval);
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [step]);

  useEffect(() => {
    if (step === "touchscreen") {
      const timeout = setTimeout(() => setStep("timeoutStepTouchScreen"), 7000);
      return () => clearTimeout(timeout);
    }
  }, [step]);

  const handlePopupResponse = (response) => {
    if (step === "display") {
      if (response === "yes") {
        setPopupMessage(null);
        setStep("touchscreen");
      } else {
        setPopupMessage("Please contact manufacturer");
      }
    } else if (step === "touchscreen") {
      if (response === "normal") {
        setPopupMessage(null);
        setStep("nextStep");
      } else if (response === "cancel") {
        navigate("/selftest");
      }
    } else if (step === "timeoutStepTouchScreen") {
      if (response === "cobalagi") {
        setPopupMessage(null);
        setStep("touchscreen");
      } else if (response === "cancel") {
        navigate("/selftest");
      }
    }
  };

  const handleDragStart = (index) => setDraggedBox(index);

  const handleDrop = (index) => {
    if (draggedBox !== null && draggedBox === index) {
      const newBoxes = [...boxes];
      newBoxes[draggedBox].moved = true;
      setBoxes(newBoxes);
      setDraggedBox(null);

      if (newBoxes.every((box) => box.moved)) {
        setPopupMessage("Touchscreen display berfungsi normal");
        handlePopupResponse("normal");
      }
    }
  };

  const renderBox = (box, index) => (
    <div key={box.id} className="w-full h-full flex justify-between items-center">
      <div
        draggable={!box.moved}
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop(index)}
        className={`w-full h-full flex justify-center items-center text-black text-lg font-semibold border ${
          box.moved ? "border-green-500 bg-blue-500" : "border-gray-300 bg-gray-200"
        } transition-all`}
      >
        {box.moved ? "✓ Sudah digeser" : "Geser bertanda biru ke kanan hingga ke tepi layar"}
      </div>
    </div>
  );

  useEffect(() => {
    if (step === "nextStep") {
      setTimeout(() => navigate("/selftest"), 2000);
    }
  }, [step, navigate]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      {step === "display" && (
        <div className="w-full h-full relative flex justify-center items-center bg-black">
          <div style={{ backgroundColor: rgbColor }} className="w-full h-full"></div>
          {popupMessage && (
            <FullScreenMessage
              message={popupMessage}
              buttons={
                <>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mr-4"
                    onClick={() => handlePopupResponse("yes")}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => handlePopupResponse("no")}
                  >
                    No
                  </button>
                </>
              }
            />
          )}
        </div>
      )}

      {step === "touchscreen" && (
        <div className="w-full h-full relative flex flex-col justify-center items-center">
          {boxes.map((box, index) => renderBox(box, index))}
          {popupMessage && (
            <FullScreenMessage
              message={popupMessage}
              buttons={
                <>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mr-4"
                    onClick={() => handlePopupResponse("normal")}
                  >
                    Next
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => handlePopupResponse("cancel")}
                  >
                    Cancel
                  </button>
                </>
              }
            />
          )}
        </div>
      )}

      {step === "timeoutStepTouchScreen" && (
        <FullScreenMessage
          message="Tes Touchscreen display timeout, silahkan coba lagi"
          buttons={
            <>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mr-4"
                onClick={() => handlePopupResponse("cobalagi")}
              >
                Coba Lagi
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => handlePopupResponse("cancel")}
              >
                Cancel
              </button>
            </>
          }
        />
      )}

      {step === "nextStep" && (
        <div className="w-full h-full flex justify-center items-center">
          <h3 className="text-2xl font-bold text-gray-800">
            Touch screen display berfungsi normal redirect ke halaman selftest
          </h3>
        </div>
      )}
    </div>
  );
};

export default SelfTestDisplay;
