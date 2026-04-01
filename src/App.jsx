import React, { useState, useMemo, useEffect } from 'react';
import { leaderboardData } from './mock';
import poster from './assets/a1.jpg';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const calculateStars = (player) => {
    const fishStars = Math.floor((player.fishCaught || 0) / 10);
    const timePenalty = Math.floor((player.time || 0) / 10);
    const skillPenalty = (player.skill || 0) * 5;
    
    const totalStars = fishStars - timePenalty - skillPenalty;
    return totalStars > 0 ? totalStars : 0;
  };

  const renderStars = (player) => {
    const starsCount = calculateStars(player);
    // Render either the exact number of stars if 5 or less, or a number with one star if more.
    if (starsCount <= 5) {
      return (
        <div className="flex items-center justify-end gap-0.5 text-yellow-500">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className="material-symbols-outlined text-sm"
              data-icon="star"
              {...(index < starsCount ? { "data-weight": "fill", style: { fontVariationSettings: "'FILL' 1" } } : {})}
            >
              star
            </span>
          ))}
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-end gap-1 text-yellow-500">
          <span className="font-bold text-sm">{starsCount}</span>
          <span
            className="material-symbols-outlined text-sm"
            data-icon="star"
            data-weight="fill"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        </div>
      );
    }
  };

  const filteredData = useMemo(() => {
    let result = leaderboardData;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(player => {
        const matchName = player.name ? player.name.toLowerCase().includes(q) : false;
        const matchId = player.id ? player.id.toLowerCase().includes(q) : false;
        return matchName || matchId;
      });
    }

    // Sort by stars descending
    return [...result].sort((a, b) => calculateStars(b) - calculateStars(a));
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md flex justify-center items-center px-8 h-20 max-w-full mx-auto shadow-[0_12px_32px_rgba(0,88,188,0.06)]">
        <div className="text-2xl font-extrabold text-black tracking-tighter brand-font">HIỆP HỘI CÂU CÁ</div>
      </nav>

      <main className="">
        {/* Hero Title Section */}
        <header className="">
          <img src={poster} alt="poster" className='w-full' />
        </header>

        {/* Podium Section (Asymmetric Bento) */}
        <section className="flex flex-col gap-6 mb-12 p-10">
          <h1 className='text-2xl font-extrabold text-black tracking-tighter brand-font text-center'>CÁCH THAM GIA</h1>
          <p>Bước 1: Quay video và đăng lên nền tảng Tiktok, ...</p>
          <p>Bước 2: Tag @venessy.0001 vào bài đăng</p>
          <p>Bước 3: Ở phần mô tả hãy ghi: số lượng cá trắng + id nhân vật + tên nhân vật</p>
          <p>Bước 4: Chờ duyệt</p>
        </section>

        <section className="flex flex-col gap-6 mb-12 p-10">
          <h1 className='text-2xl font-extrabold text-black tracking-tighter brand-font text-center'>CÁCH TÍNH ĐIỂM</h1>
          <p>10 cân cá trắng = 1 điểm</p>
          <p>Số thời gian câu càng ít càng trừ ít sao, 10 giây = 1 sao</p>
          <p>Số lượng chiêu thức càng nhiều càng trừ nhiều sao, 1 chiêu trừ 5 sao</p>
          <p>Được phép sử dụng mọi loại bug</p>
        </section>

        {/* Main Leaderboard Table */}
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden p-10">
          <div className='text-2xl font-extrabold text-black tracking-tighter brand-font text-center mb-10'>BẢNG XẾP HẠNG</div>
          
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" data-icon="search">search</span>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full transition-all" 
                placeholder="Tìm ID hoặc Tên nhân vật..." 
                type="text" 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-6 font-bold text-slate-500 uppercase text-xs tracking-widest whitespace-nowrap">Xếp hạng</th>
                  <th className="px-8 py-6 font-bold text-slate-500 uppercase text-xs tracking-widest whitespace-nowrap">Tên</th>
                  <th className="px-8 py-6 font-bold text-slate-500 uppercase text-xs tracking-widest text-center whitespace-nowrap">Số lượng cá</th>
                  <th className="px-8 py-6 font-bold text-slate-500 uppercase text-xs tracking-widest text-center whitespace-nowrap">Thời gian</th>
                  <th className="px-8 py-6 font-bold text-slate-500 uppercase text-xs tracking-widest text-center whitespace-nowrap">Số chiêu</th>
                  <th className="px-8 py-6 font-bold text-slate-500 uppercase text-xs tracking-widest text-right whitespace-nowrap">Số sao</th>
                  <th className="px-8 py-6 font-bold text-slate-500 uppercase text-xs tracking-widest text-right whitespace-nowrap">Nguồn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentData.length > 0 ? currentData.map((player, index) => {
                  const globalRank = (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                    <tr key={player.id || index} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-6 font-bold text-lg text-slate-400">
                        {globalRank === 1 ? <span className="text-yellow-500 text-2xl">🥇 1</span> : 
                         globalRank === 2 ? <span className="text-gray-400 text-2xl">🥈 2</span> : 
                         globalRank === 3 ? <span className="text-orange-400 text-2xl">🥉 3</span> : 
                         String(globalRank).padStart(2, '0')}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-on-surface whitespace-nowrap">{player.name}</span>
                          {player.id && <span className="text-xs text-gray-400 font-mono">{player.id}</span>}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-primary-container" data-icon="set_meal">set_meal</span>
                          <span className="font-bold">{player.fishCaught ? player.fishCaught.toLocaleString() : 0}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-primary-container" data-icon="timer">timer</span>
                          <span className="font-bold">{player.time ? player.time.toLocaleString() : 0}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-bold">{player.skill ? player.skill.toLocaleString() : 0}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        {renderStars(player)}
                      </td>
                      <td className="px-8 py-6 text-right">
                        {player.proofUrl ? (
                          <a
                            href={player.proofUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                            title="View Proof"
                          >
                            <span className="material-symbols-outlined text-xl" data-icon="play_arrow" style={{ fontVariationSettings: "'FILL' 1" }}>
                              play_arrow
                            </span>
                          </a>
                        ) : (
                          <span className="text-gray-400 italic text-sm">Trống</span>
                        )}
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-gray-500">
                      Không tìm thấy dữ liệu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Trang trước
              </button>
              <div className="text-sm text-gray-500 font-medium">
                Trang {currentPage} / {totalPages}
              </div>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Trang sau
              </button>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}

export default App;
