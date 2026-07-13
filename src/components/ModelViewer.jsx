import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, useProgress } from '@react-three/drei';
import { useTranslation } from 'react-i18next';

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#2980b9" wireframe transparent opacity={0.5} />
    </mesh>
  );
}

function Model({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  // 不自动居中，保持模型原始位置
  return <primitive object={scene} position={[0, 0.6, 0]} />;
}

function ModelViewer({ modelPath, themeColor = '#2980b9', backgroundImage }) {
  const { t } = useTranslation();

  if (!modelPath) {
    return (
      <div className="model-viewer-panel">
        <div className="viewer-header">
          <span>🎮 {t('detail.modelViewer')}</span>
          <span>{t('detail.rotateHint')}</span>
        </div>
        <div className="model-placeholder">
          <span className="placeholder-icon">🧪</span>
          <p>{t('detail.modelViewer')}</p>
          <p style={{ marginTop: 8, fontSize: '0.85rem', color: '#999' }}>
            3D模型文件尚未添加，请将 .glb 文件放入 public/models 目录
          </p>
        </div>
      </div>
    );
  }

  // 科技蓝风格背景
  const bgGradient = 'linear-gradient(180deg, #0a1628 0%, #112240 40%, #1a3a5c 100%)';

  return (
    <div className="model-viewer-panel">
      <div className="viewer-header">
        <span>🎮 {t('detail.modelViewer')}</span>
        <span>{t('detail.rotateHint')}</span>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        {/* 全景渲染图背景 */}
        {backgroundImage && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.35,
              zIndex: 0,
            }}
          />
        )}
        <Canvas
          camera={{ position: [2.5, 2.2, 4], fov: 42 }}
          style={{ position: 'relative', zIndex: 1, background: backgroundImage ? 'transparent' : bgGradient }}
        >
          <color attach="background" args={['#0a1628']} />

          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 8, 5]} intensity={1.0} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={0.4} />
          <directionalLight position={[0, -1, 3]} intensity={0.25} />

          <Suspense fallback={<Loader />}>
            <Model modelPath={modelPath} />
            <ContactShadows position={[0, -1.8, 0]} opacity={0.3} scale={8} blur={2} />
          </Suspense>

          <Environment preset="city" />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.6}
            minDistance={1.5}
            maxDistance={12}
            target={[0, 1.0, 0]}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default ModelViewer;
