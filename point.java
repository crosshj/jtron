/*     */ class point
/*     */ {
/*     */   int x;
/*     */   int y;
/*     */ 
/*     */   point(int paramInt1, int paramInt2)
/*     */   {
/* 372 */     this.x = paramInt1;
/* 373 */     this.y = paramInt2;
/*     */   }
/*     */   void translate(int paramInt1, int paramInt2) {
/* 376 */     this.x += paramInt1;
/* 377 */     this.y += paramInt2;
/*     */   }
/*     */   int getX() {
/* 380 */     return this.x;
/*     */   }
/*     */   int getY() {
/* 383 */     return this.y;
/*     */   }
/*     */   boolean equals(point parampoint) {
/* 386 */     return (this.x == parampoint.x) && (this.y == parampoint.y);
/*     */   }
/*     */ }

/* Location:           C:\Users\user\Documents\tron\trongui.jar
 * Qualified Name:     point
 * JD-Core Version:    0.6.0
 */