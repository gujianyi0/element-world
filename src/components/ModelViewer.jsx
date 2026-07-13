import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Bounds, useProgress } from '@react-three/drei';
import { useTranslation } from 'react-i18next';

// 加载进度显示
function Loader() {
  const { progress } = useProgress();
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#2980b9" wireframe transparent opacity={0.5} />
    </mesh>
  );
}

// 3D模型渲染组件（支持 GLB/GLTF）
function Model({ modelPath }) {
  const { scene } = useGLTF(modelPath);

  return (
    <Bounds fit clip observe margin={1.2}>
      <primitive object={scene} />
    </Bounds>
  );
}

function ModelViewer({ modelPath }) {
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

  return (
    <div className="model-viewer-panel">
      <div className="viewer-header">
        <span>🎮 {t('detail.modelViewer')}</span>
        <span>{t('detail.rotateHint')}</span>
      </div>
      <Canvas
        camera={{ position: [3, 2, 5], fov: 40 }}
        style={{ flex: 1, background: 'linear-gradient(180deg, #e8f0fe 0%, #f0f3f8 100%)' }}
      >
        {/* 灯光设置 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} />
        <directionalLight position={[0, -2, 3]} intensity={0.3} />

        <Suspense fallback={<Loader />}>
          <Model modelPath={modelPath} />
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.35}
            scale={8}
            blur={2}
          />
        </Suspense>

        {/* 环境贴图 */}
        <Environment preset="studio" />

        {/* 交互控制 */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.6}
          minDistance={1.5}
          maxDistance={15}
          target={[0, 0.5, 0]}
        />
      </Canvas>
    </div>
  );
}

export default ModelViewer;
