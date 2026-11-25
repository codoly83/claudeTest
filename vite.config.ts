import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// 빌드 파일 나누기 (2026-11-25): 큰 라이브러리를 각각 별도 파일로 만들어 500kB 경고를 없애고,
// 그 라이브러리를 쓰는 화면에 처음 들어갈 때만 내려받게 합니다. 페이지 단위 분리는 App.tsx의 React.lazy.
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // React는 모든 화면이 쓰므로 가장 먼저 가져감 (다른 묶음이 의존성으로 끌어가지 않게)
            { name: 'vendorReact', priority: 3, test: /node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/ },
            { name: 'vendorChart', test: /node_modules[\\/]recharts[\\/]/ },
            // recharts 의존 라이브러리는 recharts 본체(약 500kB)와 따로 묶음 (priority가 높아야 먼저 가져감)
            { name: 'vendorChartDeps', priority: 2, test: /node_modules[\\/](d3-[^\\/]+|victory-vendor|@reduxjs|redux|react-redux|reselect|immer|es-toolkit|decimal\.js-light|eventemitter3|use-sync-external-store|tiny-invariant|clsx)[\\/]/ },
            { name: 'vendorSwiper', test: /node_modules[\\/]swiper[\\/]/ },
            { name: 'vendorDate', test: /node_modules[\\/](react-day-picker|date-fns|@date-fns)[\\/]/ },
            { name: 'vendorDnd', test: /node_modules[\\/]@dnd-kit[\\/]/ }
          ]
        }
      }
    }
  }
})
