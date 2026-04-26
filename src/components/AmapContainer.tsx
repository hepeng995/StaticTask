import { useEffect, useRef, useState } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, X, Navigation, Check, Search, Camera } from 'lucide-react';

declare global {
  interface Window {
    _AMapSecurityConfig?: {
      securityJsCode: string;
    }
  }
}

interface CheckIn {
  id: string;
  position: [number, number];
  label: string;
  description?: string;
  image?: string;
  user: string;
  timestamp: number;
}

export function BrutalistAmap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const placeSearchRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [viewingCheckin, setViewingCheckin] = useState<CheckIn | null>(null);
  const [tempPos, setTempPos] = useState<[number, number] | null>(null);
  const [checkinLabel, setCheckinLabel] = useState('');
  const [checkinDescription, setCheckinDescription] = useState('');
  const [checkinImage, setCheckinImage] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const mapKey = (import.meta as any).env?.VITE_AMAP_KEY;
  const securityCode = (import.meta as any).env?.VITE_AMAP_SECURITY_CODE;

  // Load checkins from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem('team_checkins');
    if (saved) {
      try {
        setCheckins(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse checkins", e);
      }
    }
  }, []);

  // Save checkins to localStorage when changed
  useEffect(() => {
    try {
      if (checkins.length > 0) {
        localStorage.setItem('team_checkins', JSON.stringify(checkins));
      } else {
        localStorage.removeItem('team_checkins');
      }
    } catch (e) {
      console.error("Local storage error:", e);
      // Removed alert as it can cause issues in iframes
    }
  }, [checkins]);

  useEffect(() => {
    let isMounted = true;
    
    if (!mapKey) {
      console.warn("VITE_AMAP_KEY is not defined. Map will not be loaded.");
      return;
    }

    window._AMapSecurityConfig = {
      securityJsCode: securityCode || "",
    };

    AMapLoader.load({
      key: mapKey,
      version: '2.0',
      plugins: ['AMap.Marker', 'AMap.PlaceSearch'],
    }).then((AMapInstance) => {
      if (!isMounted || !mapContainerRef.current) return;

      try {
        const map = new AMapInstance.Map(mapContainerRef.current, {
          zoom: 15,
          center: [116.397428, 39.90923],
          mapStyle: 'amap://styles/grey',
          viewMode: '3D',
        });

        mapRef.current = map;

        const placeSearch = new AMapInstance.PlaceSearch({
          pageSize: 5,
          pageIndex: 1,
        });
        placeSearchRef.current = placeSearch;

        // Handle map click for check-in
        map.on('click', (e: any) => {
          if (e && e.lnglat) {
            const lnglat = [e.lnglat.getLng(), e.lnglat.getLat()] as [number, number];
            setTempPos(lnglat);
            setIsCheckingIn(true);
            setViewingCheckin(null);
          }
        });

        // Add markers once map is created
        map.on('complete', () => {
           if (!isMounted) return;
           setMapLoaded(true);
        });

        // Add initial marker immediately or on complete
        addMarker(AMapInstance, map, [116.397428, 39.90923], '梦开始的网吧', 'System', true);
      } catch (err) {
        console.error("Map initialization failed:", err);
        setHasError(true);
      }
    }).catch((e) => {
      if (!isMounted) return;
      console.error("AMap Load Error:", e);
      setHasError(true);
    });

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [mapKey, securityCode]);

  // Update markers when checkins change
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    
    const AMap = (window as any).AMap;
    if (!AMap) return;

    try {
      // Remove all existing markers
      mapRef.current.clearMap();

      // Add initial marker
      addMarker(AMap, mapRef.current, [116.397428, 39.90923], '梦开始的网吧', 'System', true);

      // Add all checkins safely
      checkins.forEach(ci => {
        if (ci && ci.position && Array.isArray(ci.position) && ci.position.length === 2) {
          addMarker(AMap, mapRef.current, ci.position, ci.label || '未命名', ci.user || 'Unknown', false, ci);
        }
      });
    } catch (err) {
      console.error('Error drawing markers', err);
    }

  }, [checkins, mapLoaded]);

  const addMarker = (AMap: any, map: any, position: [number, number], label: string, user: string, isSystem = false, checkinData?: CheckIn) => {
    if (!position || isNaN(position[0]) || isNaN(position[1])) return;

    const markerContent = document.createElement('div');
    markerContent.className = 'group flex flex-col items-center animate-in fade-in zoom-in duration-300' + (!isSystem ? ' cursor-pointer' : '');
    // Ensure the tooltip escapes typical fixed stacking if needed
    markerContent.style.position = 'relative';
    
    const colorClass = isSystem ? 'text-neon-pink' : 'text-neon-blue';
    const shadowClass = isSystem ? 'shadow-[2px_2px_0_#FF5C00]' : 'shadow-[2px_2px_0_#00D1FF]';
    const borderClass = isSystem ? 'border-neon-pink' : 'border-neon-blue';

    const pinHtml = `
      <div style="display:flex; flex-direction:column; align-items:center; position: relative;">
        <!-- Tooltip container (hidden by default, shown on hover/group-hover) -->
        <div class="absolute -top-16 opacity-0 scale-95 origin-bottom transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 pointer-events-none z-50">
          <div class="bg-black text-white text-[10px] px-3 py-1.5 !rounded-none border-2 ${borderClass} font-bold uppercase ${shadowClass} flex flex-col items-center" style="white-space:nowrap;">
            <span>${label}</span>
            ${!isSystem ? `<span class="opacity-50 text-[8px] mt-0.5">BY: ${user}</span>` : ''}
          </div>
          <!-- Little arrow pointing down -->
          <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] ${isSystem ? 'border-t-[#FF5C00]' : 'border-t-[#00D1FF]'} mx-auto mt-0.5 pointer-events-none"></div>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 ${colorClass} drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-110"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
    `;
    markerContent.innerHTML = pinHtml;

    const marker = new AMap.Marker({
      position,
      content: markerContent,
      offset: new AMap.Pixel(-16, -38),
      title: label // Still natively sets title as quick native tooltip fallback if needed, harmless
    });

    if (checkinData) {
      marker.on('click', () => {
        setIsCheckingIn(false);
        setViewingCheckin(checkinData);
      });
    }

    map.add(marker);
  };

  const submitCheckin = () => {
    if (!tempPos || !checkinLabel.trim()) return;

    const newCheckin: CheckIn = {
      id: Math.random().toString(36).substr(2, 9),
      position: tempPos,
      label: checkinLabel,
      description: checkinDescription.trim() || undefined,
      image: checkinImage,
      user: '精英黑客', // Mock user
      timestamp: Date.now()
    };

    setCheckins([...checkins, newCheckin]);
    setIsCheckingIn(false);
    setCheckinLabel('');
    setCheckinDescription('');
    setCheckinImage(undefined);
    setTempPos(null);
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          setCheckinImage(canvas.toDataURL('image/jpeg', 0.6)); // Compress to 60% quality JPEG
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteCheckin = (id: string) => {
    setCheckins(prev => prev.filter(c => c.id !== id));
    setViewingCheckin(null);
  };

  const handleSearch = () => {
    if (!searchQuery.trim() || !placeSearchRef.current) return;
    placeSearchRef.current.search(searchQuery, (status: string, result: any) => {
      if (status === 'complete' && result.info === 'OK') {
        setSearchResults(result.poiList.pois);
      } else {
        setSearchResults([]);
      }
    });
  };

  const handleSelectPlace = (poi: any) => {
    if (!mapRef.current) return;
    const lnglat = [poi.location.lng, poi.location.lat] as [number, number];
    mapRef.current.setCenter(lnglat);
    mapRef.current.setZoom(16);
    setSearchQuery('');
    setSearchResults([]);
    
    // Auto trigger check-in drawer
    setTempPos(lnglat);
    setCheckinLabel(poi.name);
    setIsCheckingIn(true);
  };

  if (!mapKey) {
    return (
      <div className="h-[400px] glass-card !rounded-none border-4 border-black dark:border-white shadow-[8px_8px_0_var(--color-ink)] w-full bg-[#e5e7eb] dark:bg-black relative overflow-hidden flex flex-col items-center justify-center p-8">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #888 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <MapPin className="w-12 h-12 text-black/50 dark:text-white/50 mb-4 relative z-10" />
        <h4 className="relative z-10 font-bold text-xl uppercase tracking-widest text-center whitespace-pre-wrap">高德地图模块等待接入</h4>
        <p className="relative z-10 font-mono text-sm mt-4 text-center border-4 border-dashed border-black/50 dark:border-white/50 p-4 bg-white/50 dark:bg-black/50 shadow-[4px_4px_0_var(--color-ink)]">
          1. 通过 <b>环境变量 (Secrets)</b> 配置 API.<br/><br/>
          所需变量:<br/>
          <span className="text-neon-pink">VITE_AMAP_KEY</span><br/>
          <span className="text-neon-blue">VITE_AMAP_SECURITY_CODE</span>
        </p>
      </div>
    );
  }

  return (
    <div className="h-[500px] glass-card !rounded-none border-4 border-black dark:border-white shadow-[8px_8px_0_var(--color-ink)] w-full relative overflow-hidden group bg-[#0a0a0a]">
      {!mapLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10 font-mono font-bold uppercase tracking-widest animate-pulse text-white">
          INITIALIZING GEOLOCATION...
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 z-20 overflow-hidden flex flex-col justify-center items-center">
          {/* Mock Cyber Grid Background */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#00ff00 1px, transparent 1px), linear-gradient(90deg, #00ff00 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) scale(2)', transformOrigin: 'top center' }} />
          
          <div className="relative z-30 bg-black/80 border-2 border-neon-pink p-6 max-w-lg text-center shadow-[8px_8px_0_#ff00ff] backdrop-blur-md">
            <div className="text-xl mb-2 font-black text-neon-pink tracking-widest flex items-center justify-center gap-3">
              <X className="w-8 h-8" /> <span>OFFLINE_MODE_ACTIVE</span>
            </div>
            <div className="text-xs text-white opacity-90 leading-relaxed font-mono">
              [SYSTEM]: 无法连接到 AMap 卫星代理网络 (API Key 无效或跨域阻止)。<br/><br/>
              已切换至脱机坐标网格显示模式。离线模式下无法加载在线瓦片图层，但您可以继续预览本地已部署的地理标记坐标。
            </div>
          </div>

          {/* Render Mock Checkins */}
          {checkins.map(checkin => {
            // Rough normalization to 0-100% just to put them somewhere on the screen based on their lng/lat
            // Assuming centered roughly around Beijing with a narrow spread for demo
            const normalizedX = Math.max(10, Math.min(90, 50 + (checkin.position[0] - 116.397) * 50));
            const normalizedY = Math.max(10, Math.min(90, 50 - (checkin.position[1] - 39.909) * 50));

            return (
              <div 
                key={checkin.id}
                className="absolute z-20 group/marker flex flex-col items-center cursor-pointer pointer-events-auto"
                style={{ left: `${normalizedX}%`, top: `${normalizedY}%`, transform: 'translate(-50%, -100%)' }}
                onClick={() => setViewingCheckin(checkin)}
              >
                <div className="bg-neon-green text-black px-2 py-0.5 text-[10px] font-mono font-bold whitespace-nowrap shadow-[2px_2px_0_#fff] mb-1 opacity-0 group-hover/marker:opacity-100 transition-opacity translate-y-2 group-hover/marker:translate-y-0 relative z-10 border border-black">
                  {checkin.label.substring(0, 10)}{checkin.label.length > 10 ? '...' : ''}
                </div>
                <div className="relative w-8 h-8 bg-black border-2 border-white flex items-center justify-center shadow-[3px_3px_0_#00ff00] group-hover/marker:-translate-y-1 transition-transform">
                  <MapPin className="w-5 h-5 text-neon-green" />
                  <div className="absolute -bottom-2 w-1 h-3 bg-white left-1/2 -translate-x-1/2"></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating UI: Instructions */}
      <div className="absolute top-4 left-4 z-30 pointer-events-none">
        <div className="bg-black/80 text-white text-[10px] p-2 border border-white/20 backdrop-blur font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          [指令]: 点击地图(或离线网格)搜寻目标坐标以存档
        </div>
      </div>

      {/* Search UI */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end w-64 max-w-[calc(100%-2rem)]">
        <div className="flex w-full group shadow-[4px_4px_0_var(--color-ink)] pointer-events-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="搜寻目标坐标..."
            className="w-full bg-white dark:bg-[#1a1a1a] text-black dark:text-white border-2 border-black dark:border-white p-2 text-sm font-bold placeholder:opacity-50 outline-none focus:bg-white dark:focus:bg-[#1a1a1a] transition-colors"
          />
          <button
            onClick={handleSearch}
            className="bg-accent-color text-black border-2 border-l-0 border-black dark:border-white px-3 hover:bg-neon-blue transition-colors flex items-center justify-center cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
        
        {searchResults.length > 0 && (
          <div className="w-full mt-4 bg-white dark:bg-black border-4 border-black dark:border-white shadow-[8px_8px_0_var(--color-ink)] flex flex-col max-h-60 overflow-y-auto pointer-events-auto filter drop-shadow-lg">
            <div className="flex justify-between items-center p-2 bg-black text-white text-[10px] uppercase font-bold tracking-widest sticky top-0 z-10">
              <span>检索结果 ({searchResults.length})</span>
              <button onClick={() => setSearchResults([])} className="hover:text-neon-pink p-1">
                <X className="w-3 h-3" />
              </button>
            </div>
            {searchResults.map((poi, i) => (
              <button
                key={i}
                onClick={() => handleSelectPlace(poi)}
                className="text-left p-3 border-b border-black/20 dark:border-white/20 hover:bg-neon-blue/10 transition-colors last:border-b-0 group cursor-pointer block w-full"
              >
                <div className="font-bold text-sm truncate group-hover:text-neon-blue transition-colors leading-tight">{poi.name}</div>
                <div className="opacity-50 text-[10px] truncate mt-1 leading-tight">{poi.address || poi.district || '未知区域'}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div 
        ref={mapContainerRef} 
        className="w-full h-full filter contrast-110 saturate-[0.8] dark:saturate-[0.3]"
      />

      {/* Check-in Modal Overlay */}
      <AnimatePresence>
        {isCheckingIn && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-black border-4 border-black dark:border-white w-full max-w-sm shadow-[8px_8px_0_var(--color-ink)] relative flex flex-col max-h-[90%]"
            >
              {/* Scanline effect */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-neon-blue/30 animate-[scan_3s_linear_infinite] pointer-events-none z-50"></div>
              
              <button 
                onClick={() => setIsCheckingIn(false)}
                className="absolute top-2 right-2 p-1 hover:bg-neon-pink hover:text-white transition-colors z-10 bg-white/80 dark:bg-black/80 backdrop-blur"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 pb-4 shrink-0 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Navigation className="w-6 h-6 text-neon-blue animate-pulse" />
                  <h3 className="font-black text-xl uppercase tracking-tighter">新坐标打卡</h3>
                </div>
              </div>

              <div className="p-6 pt-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-black dark:scrollbar-thumb-white scrollbar-track-transparent">
                <div>
                  <label className="block text-[10px] font-mono mb-1 opacity-60 uppercase">坐标位置</label>
                  <div className="bg-black text-white p-2 font-mono text-xs border border-white/20 select-all">
                    LNG: {tempPos?.[0].toFixed(6)} <br/>
                    LAT: {tempPos?.[1].toFixed(6)}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono mb-1 opacity-60 uppercase">标记说明</label>
                  <input 
                    autoFocus
                    type="text" 
                    value={checkinLabel}
                    onChange={(e) => setCheckinLabel(e.target.value)}
                    placeholder="输入该地点的含义..."
                    className="w-full bg-transparent border-2 border-black dark:border-white p-3 font-bold placeholder:opacity-40 focus:bg-accent-color/5 outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && submitCheckin()}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono mb-1 opacity-60 uppercase">数据备忘录 (可选)</label>
                  <textarea 
                    value={checkinDescription}
                    onChange={(e) => setCheckinDescription(e.target.value)}
                    placeholder="记录下更多细节..."
                    className="w-full bg-transparent border-2 border-black dark:border-white p-3 text-sm font-bold placeholder:opacity-40 focus:bg-accent-color/5 outline-none resize-none h-20"
                  />
                </div>

                <div>
                   <label className="block text-[10px] font-mono mb-1 opacity-60 uppercase">影像上传 (可选)</label>
                   {checkinImage ? (
                     <div className="relative w-full h-24 border-2 border-black dark:border-white overflow-hidden group shrink-0">
                       <img src={checkinImage} alt="preview" className="w-full h-full object-cover filter grayscale contrast-125" />
                       <button onClick={() => setCheckinImage(undefined)} className="absolute top-2 right-2 p-1 bg-black text-white hover:bg-neon-pink border border-transparent hover:border-white">
                         <X className="w-4 h-4" />
                       </button>
                     </div>
                   ) : (
                     <label className="flex items-center justify-center w-full h-12 border-2 border-dashed border-black/50 dark:border-white/50 hover:border-solid hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors shrink-0">
                       <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                       <Camera className="w-4 h-4 mr-2" />
                       <span className="text-xs font-bold uppercase tracking-widest">提供图片证据</span>
                     </label>
                   )}
                </div>

                <div className="flex gap-2 pt-2 sticky bottom-0 bg-white dark:bg-black border-t border-black/10 dark:border-white/10 mt-4 pb-2">
                  <button 
                    onClick={() => setIsCheckingIn(false)}
                    className="flex-1 py-3 font-bold border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all uppercase tracking-widest text-xs"
                  >
                    取消
                  </button>
                  <button 
                    onClick={submitCheckin}
                    disabled={!checkinLabel.trim()}
                    className="flex-[2] py-3 font-bold bg-accent-color text-black border-2 border-black dark:border-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0_var(--color-ink)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-4 h-4" /> 确认打卡
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {viewingCheckin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-black border-4 border-black dark:border-white w-full max-w-sm shadow-[8px_8px_0_var(--color-ink)] relative flex flex-col max-h-[90%]"
            >
              {/* Scanline effect */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-neon-pink/30 animate-[scan_3s_linear_infinite] pointer-events-none z-50"></div>
              
              <button 
                onClick={() => setViewingCheckin(null)}
                className="absolute top-2 right-2 p-1 hover:bg-neon-pink hover:text-white transition-colors z-10 bg-white/80 dark:bg-black/80 backdrop-blur"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 pb-4 shrink-0 border-b border-black/10 dark:border-white/10">
                 <h3 className="font-black text-xl uppercase tracking-tighter text-neon-blue m-0">目标坐标档案</h3>
              </div>
              
              <div className="p-6 pt-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-black dark:scrollbar-thumb-white scrollbar-track-transparent">
                {viewingCheckin.image && (
                  <div className="w-full relative border-4 border-black dark:border-white overflow-hidden bg-black/5 shrink-0 shadow-[4px_4px_0_var(--color-ink)] mb-4 group cursor-pointer">
                     <img 
                       src={viewingCheckin.image} 
                       className="w-full h-auto max-h-64 object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" 
                       alt="证据影像" 
                     />
                     <div className="absolute bottom-2 right-2 bg-black text-white px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-widest border border-white opacity-0 group-hover:opacity-100 transition-opacity">
                       IMAGE_RECORD // VALID
                     </div>
                  </div>
                )}
                
                <div className="p-4 border-2 border-black dark:border-white bg-black/5 dark:bg-white/5 relative overflow-hidden">
                  {/* Decorative background grid */}
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                  <div className="text-xl font-black mb-2 relative z-10">{viewingCheckin.label}</div>
                  
                  {viewingCheckin.description && (
                    <div className="text-xs font-medium border-l-2 border-neon-blue pl-2 py-1 mb-4 opacity-80 whitespace-pre-wrap relative z-10">
                      {viewingCheckin.description}
                    </div>
                  )}
                  
                  <div className="text-xs font-mono opacity-60 uppercase relative z-10 tracking-widest"><span className="text-neon-pink">BY: </span>{viewingCheckin.user}</div>
                  <div className="text-[10px] font-mono opacity-40 mt-2 relative z-10 border-t border-dashed border-current pt-2">SYS.TIME: {new Date(viewingCheckin.timestamp).toLocaleString()}</div>
                </div>

                <div className="flex gap-2 pt-2 sticky bottom-0 bg-white dark:bg-black border-t border-black/10 dark:border-white/10 mt-4 pb-2">
                  <button 
                    onClick={() => setViewingCheckin(null)}
                    className="flex-[2] py-3 font-bold border-2 border-black dark:border-white hover:bg-neon-blue transition-colors uppercase tracking-widest text-xs"
                  >
                    了解
                  </button>
                  <button 
                    onClick={() => handleDeleteCheckin(viewingCheckin.id)}
                    className="flex-1 py-3 font-bold bg-transparent text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest text-xs"
                  >
                    移除
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          from { top: 0; }
          to { top: 100%; }
        }
      `}} />
    </div>
  );
}

