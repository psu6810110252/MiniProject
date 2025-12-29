import { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState('กำลังเชื่อมต่อ...')

  useEffect(() => {
    // ยิงไปหา Backend Port 3000
    fetch('http://localhost:3000')
      .then(res => res.text()) // แปลงผลลัพธ์เป็นข้อความ
      .then(data => setStatus(`✅ เชื่อมต่อสำเร็จ! ข้อความจากหลังบ้าน: ${data}`))
      .catch(err => setStatus(`❌ เชื่อมต่อไม่ได้: ${err}`))
  }, [])

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>ทดสอบระบบ</h1>
      <h2 style={{ color: status.includes('สำเร็จ') ? 'green' : 'red' }}>
        {status}
      </h2>
    </div>
  )
}

export default App