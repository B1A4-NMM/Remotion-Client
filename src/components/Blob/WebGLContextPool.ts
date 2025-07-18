// WebGLContextPool.ts
class WebGLContextPool {
    private static instance: WebGLContextPool;
    private contexts: Map<string, any> = new Map();
    private maxContexts = 8; // 브라우저 한계보다 낮게 설정
    private activeContexts = 0;
  
    static getInstance() {
      if (!WebGLContextPool.instance) {
        WebGLContextPool.instance = new WebGLContextPool();
      }
      return WebGLContextPool.instance;
    }
  
    requestContext(id: string): boolean {
      if (this.contexts.has(id)) {
        return true;
      }
  
      if (this.activeContexts >= this.maxContexts) {
        // 가장 오래된 컨텍스트 제거
        const oldestId = this.contexts.keys().next().value;
        this.releaseContext(oldestId);
      }
  
      this.contexts.set(id, Date.now());
      this.activeContexts++;
      return true;
    }
  
    releaseContext(id: string) {
      if (this.contexts.has(id)) {
        this.contexts.delete(id);
        this.activeContexts--;
      }
    }
  
    canRender(id: string): boolean {
      return this.contexts.has(id);
    }
  }
  
  export default WebGLContextPool;
  