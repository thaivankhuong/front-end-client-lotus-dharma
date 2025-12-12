import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">404 - Trang không tìm thấy</h2>
            <p className="text-gray-600 mb-4">Xin lỗi, trang bạn tìm kiếm không tồn tại.</p>
            <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Về trang chủ
            </Link>
        </div>
    )
}
