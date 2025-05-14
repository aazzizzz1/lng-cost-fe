import React from 'react'
import { useNavigate } from 'react-router-dom'
import BackgroundLNG from "../../Assets/Images/PLI.jpeg";

const DashboardPages = () => {
  const navigate = useNavigate()

  const handleClick = (path) => {
    navigate(path)
  }

  return (
    <div className="relative w-full h-screen bg-blue-200">
      {/* Background Gambar Utama */}
      <img src={BackgroundLNG} alt="LNG Diagram" className="w-full h-auto" />

      {/* Tombol Interaktif - Posisi disesuaikan dengan posisi gambar */}
      <button
        onClick={() => handleClick('/storage')}
        className="absolute top-[20%] left-[10%] w-[80px] h-[80px] bg-transparent"
        title="Storage"
      />

      <button
        onClick={() => handleClick('/fsru')}
        className="absolute top-[10%] left-[30%] w-[80px] h-[80px] bg-transparent"
        title="FSRU / LNGC"
      />

      <button
        onClick={() => handleClick('/offshore-platform')}
        className="absolute top-[10%] left-[60%] w-[80px] h-[80px] bg-transparent"
        title="Offshore Platform"
      />

      <button
        onClick={() => handleClick('/tank')}
        className="absolute top-[50%] left-[40%] w-[80px] h-[80px] bg-transparent"
        title="Tank"
      />

      <button
        onClick={() => handleClick('/truck-tank')}
        className="absolute top-[70%] left-[20%] w-[80px] h-[80px] bg-transparent"
        title="Truck Tank"
      />

      <button
        onClick={() => handleClick('/plant')}
        className="absolute top-[70%] left-[60%] w-[80px] h-[80px] bg-transparent"
        title="Plant"
      />
    </div>
  )
}

export default DashboardPages
