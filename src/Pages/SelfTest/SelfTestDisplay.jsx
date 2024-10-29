import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SelfTestDisplay = () => {
  const [step, setStep] = useState("display"); // Mengelola tahap pengujian
  const [popupMessage, setPopupMessage] = useState(null); // Pesan pop-up
  const [rgbColor, setRgbColor] = useState("rgb(255, 0, 0)"); // Warna tampilan awal
  const [boxes, setBoxes] = useState([
    { id: 1, moved: false },
    { id: 2, moved: false },
    { id: 3, moved: false },
  ]); // Kotak yang perlu digeser
  const [draggedBox, setDraggedBox] = useState(null); // Kontrol box yang sedang di-drag
  const navigate = useNavigate(); // Inisialisasi navigate

  // RGB Display Test
  useEffect(() => {
    if (step === "display") {
      const rgbSequence = [
        "rgb(255, 0, 0)",
        "rgb(0, 255, 0)",
        "rgb(0, 0, 255)",
      ];
      let index = 0;
      const interval = setInterval(() => {
        setRgbColor(rgbSequence[index]);
        index = (index + 1) % rgbSequence.length;
      }, 1000);

      setTimeout(() => {
        setPopupMessage("Apakah display lcd berwarna normal? Yes/No");
        clearInterval(interval);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [step]);

  // Fungsi untuk menangani respon popup
  const handlePopupResponse = (response) => {
    if (step === "display") {
      if (response === "yes") {
        setPopupMessage(null);
        setStep("touchscreen"); // Lanjutkan ke tes touchscreen
      } else {
        setPopupMessage("Please contact manufacturer");
      }
    } else if (step === "touchscreen" && response === "normal") {
      setPopupMessage(null);
      setStep("nextStep"); // Lanjutkan ke langkah berikutnya setelah tes touchscreen
    }
  };

  // Fungsi drag untuk tes touchscreen
  const handleDragStart = (index) => {
    setDraggedBox(index);
  };

  const handleDrop = (index) => {
    if (draggedBox !== null && draggedBox === index) {
      const newBoxes = [...boxes];
      newBoxes[draggedBox].moved = true;
      setBoxes(newBoxes);
      setDraggedBox(null);

      // Periksa apakah semua kotak sudah digeser
      const allMoved = newBoxes.every((box) => box.moved);
      if (allMoved) {
        setPopupMessage("Touchscreen display berfungsi normal");
      }
    }
  };

  // Fungsi untuk merender kotak pada tes touchscreen
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
      {box.moved
        ? "✓ Sudah digeser"
        : "Geser bertanda biru ke kanan hingga ke tepi layar"}
    </div>
  </div>
  );

  // Efek redirect ke /selftest setelah tes selesai
  useEffect(() => {
    if (step === "nextStep") {
      setTimeout(() => {
        navigate("/selftest"); // Redirect ke halaman selftest setelah tes selesai
      }, 2000); // Waktu tunggu sebelum redirect, bisa disesuaikan
    }
  }, [step, navigate]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      {step === "display" && (
        <div className="w-full h-full relative flex justify-center items-center bg-black">
          <div
            style={{ backgroundColor: rgbColor }}
            className="w-full h-full"
          ></div>
          {popupMessage && (
            <div className="absolute bottom-10 bg-white p-4 rounded-lg shadow-lg text-center">
              <p className="mb-4 text-black">{popupMessage}</p>
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
            </div>
          )}
        </div>
      )}

      {step === "touchscreen" && (
        <div className="w-full h-full relative flex flex-col justify-center items-center">
          {boxes.map((box, index) => renderBox(box, index))}
          {popupMessage && (
            <div className="absolute bottom-10 bg-white p-4 rounded-lg shadow-lg text-center">
              <p className="mb-4 text-black">{popupMessage}</p>
              {popupMessage === "Touchscreen display berfungsi normal" && (
                <>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mr-4"
                    onClick={() => handlePopupResponse("normal")}
                  >
                    Next
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => setStep("cancel")}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {step === "nextStep" && (
        <div className="w-full h-full flex justify-center items-center">
          <h3 className="text-2xl font-bold text-gray-800">
            Redirect ke Self Test Pages Step berikutnya dimulai di sini...
          </h3>
        </div>
      )}
    </div>
  );
};

export default SelfTestDisplay;
