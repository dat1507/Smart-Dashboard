import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Maximize2, Minimize2, Power, GripHorizontal } from 'lucide-react';

const GestureControl = ({ onGestureDetected }) => {
    const [isActive, setIsActive] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [currentStatus, setCurrentStatus] = useState("Đang khởi tạo...");
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const cameraRef = useRef(null);
    const handsRef = useRef(null);

    // State phục vụ tracking Swipe (lịch sử vị trí để tính toán chuyển động mượt)
    const positionBufferRef = useRef([]);
    const lastGestureTimeRef = useRef(0);

    // Refs đồng bộ prop/state vào ref để callback onResults đọc không bị stale closure
    const isActiveRef = useRef(isActive);
    const isMinimizedRef = useRef(isMinimized);
    const onGestureDetectedRef = useRef(onGestureDetected);
    
    useEffect(() => {
        isActiveRef.current = isActive;
        isMinimizedRef.current = isMinimized;
        onGestureDetectedRef.current = onGestureDetected;
    }, [isActive, isMinimized, onGestureDetected]);

    const SWIPE_THRESHOLD = 0.15; 
    const COOLDOWN_MS = 1500; 

    const onResults = (results) => {
        if (!isActiveRef.current) return;

        const canvasCtx = canvasRef.current?.getContext('2d');
        if (!canvasCtx || !canvasRef.current || !videoRef.current) return;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            
            if (window.drawConnectors && window.HAND_CONNECTIONS) {
                window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
            }
            if (window.drawLandmarks) {
                window.drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1, radius: 2 });
            }
            
            canvasCtx.restore(); 

            const indexFingerTip = landmarks[8];
            const currentX = indexFingerTip.x;
            const now = Date.now();

            positionBufferRef.current.push({ x: currentX, time: now });
            positionBufferRef.current = positionBufferRef.current.filter(p => now - p.time <= 300);

            if (now - lastGestureTimeRef.current > COOLDOWN_MS) {
                if (positionBufferRef.current.length > 0) {
                    const oldestPoint = positionBufferRef.current[0];
                    const deltaX = currentX - oldestPoint.x;

                    if (deltaX < -SWIPE_THRESHOLD) {
                        setCurrentStatus("Swipe Right");
                        onGestureDetectedRef.current("Swipe_Right");
                        lastGestureTimeRef.current = now;
                        positionBufferRef.current = []; 
                        return;
                    } else if (deltaX > SWIPE_THRESHOLD) {
                        setCurrentStatus("Swipe Left");
                        onGestureDetectedRef.current("Swipe_Left");
                        lastGestureTimeRef.current = now;
                        positionBufferRef.current = [];
                        return;
                    }
                }
            }
            
            if (now - lastGestureTimeRef.current > COOLDOWN_MS) {
                setCurrentStatus("Idle / Tracking");
            }
        } else {
            canvasCtx.restore();
            positionBufferRef.current = []; 
            if (Date.now() - lastGestureTimeRef.current > COOLDOWN_MS) {
                setCurrentStatus("No hand detected");
            }
        }
    };

    useEffect(() => {
        const initializeMediaPipe = () => {
            if (!window.Hands) {
                console.error("MediaPipe Hands library not loaded!");
                return;
            }
            handsRef.current = new window.Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                }
            });

            handsRef.current.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.7,
                minTrackingConfidence: 0.7
            });

            handsRef.current.onResults(onResults);

            if (videoRef.current) {
                if (!window.Camera) {
                    console.error("MediaPipe Camera util not loaded!");
                    return;
                }
                cameraRef.current = new window.Camera(videoRef.current, {
                    onFrame: async () => {
                        if (handsRef.current && isActiveRef.current) {
                            await handsRef.current.send({ image: videoRef.current });
                        }
                    },
                    width: 400,
                    height: 300
                });
            }
        };

        if (!handsRef.current) {
            initializeMediaPipe();
        }

        return () => {
            if (cameraRef.current) {
                cameraRef.current.stop();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    // Xử lý Toggle Bật/Tắt (chạy lại mỗi khi isActive đổi)
    useEffect(() => {
        if (cameraRef.current) {
            if (isActive) {
                cameraRef.current.start();
                setCurrentStatus("Ready");
            } else {
                cameraRef.current.stop();
                setCurrentStatus("Turned off");
            }
        }
    }, [isActive]);

    // Ref required for react-draggable in React 19
    const nodeRef = useRef(null);

    return (
        <Draggable nodeRef={nodeRef} handle=".drag-handle" bounds="body">
            <div ref={nodeRef} className={`fixed bottom-8 right-8 z-[1000] border border-slate-700/60 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)] bg-slate-900/90 backdrop-blur-xl transition-all duration-300 ${isMinimized ? 'w-48' : 'w-64'}`}>
                {/* Header / Toggle */}
                <div className="drag-handle bg-slate-800/80 text-white flex justify-between items-center px-3 py-2 cursor-move border-b border-slate-700/50 hover:bg-slate-700/80 transition-colors">
                    <div className="flex items-center gap-2">
                        <GripHorizontal size={14} className="text-slate-400" />
                        <span className="text-xs font-semibold tracking-wider flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#39ff14] shadow-[0_0_8px_#39ff14]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}></span>
                            AI VISION
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button 
                            onClick={() => setIsMinimized(!isMinimized)} 
                            className="p-1 hover:bg-slate-600 rounded text-slate-300 hover:text-white transition-colors" 
                            title={isMinimized ? "Maximize" : "Minimize"}
                        >
                            {isMinimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
                        </button>
                        <button 
                            onClick={() => setIsActive(!isActive)} 
                            className={`p-1 rounded transition-colors ${isActive ? 'hover:bg-red-500/20 text-red-500' : 'hover:bg-[#39ff14]/20 text-[#39ff14]'}`} 
                            title={isActive ? "Turn Off" : "Turn On"}
                        >
                            <Power size={13} />
                        </button>
                    </div>
                </div>

                {/* Video Input (Ẩn) */}
                <video 
                    ref={videoRef} 
                    className="input_video hidden" 
                    playsInline
                ></video>

                {/* Canvas Output */}
                <div className={`relative ${isActive && !isMinimized ? 'block' : 'hidden'}`}>
                    <canvas 
                        ref={canvasRef} 
                        className="output_canvas w-full h-auto block scale-x-[-1]" 
                        width="240" 
                        height="180"
                    ></canvas>
                    
                    {/* Lớp mờ hiển thị kết quả */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent text-white text-center">
                        <div className="text-xs font-bold tracking-wide text-slate-200">{currentStatus}</div>
                    </div>
                </div>

                {/* Minimized Status */}
                {isActive && isMinimized && (
                    <div className="p-3 text-center text-slate-300 text-xs font-medium">
                        {currentStatus}
                    </div>
                )}
            </div>
        </Draggable>
    );
};

export default GestureControl;