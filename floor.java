/*    */ import java.awt.Color;
/*    */ import java.awt.Dimension;
/*    */ import java.awt.Graphics;
/*    */ 
/*    */ class floor extends Space
/*    */ {
/*    */   public boolean occupied;
/*    */   public boolean up;
/*    */   public boolean right;
/*    */   public boolean down;
/*    */   public boolean left;
/*    */   public boolean start;
/*    */   Color c;
/*    */ 
/*    */   public boolean isOccupied()
/*    */   {
/* 15 */     return this.occupied;
/*    */   }
/*    */   public Dimension getPreferredSize() {
/* 18 */     return new Dimension(15, 15);
/*    */   }
/*    */ 
/*    */   protected void paintComponent(Graphics paramGraphics) {
/* 22 */     int i = getWidth();
/* 23 */     int j = getHeight();
/* 24 */     paramGraphics.setColor(Color.lightGray);
/* 25 */     paramGraphics.fillRect(0, 0, i / 2, j / 2);
/* 26 */     paramGraphics.fillRect(i / 2, j / 2, i, j);
/* 27 */     paramGraphics.setColor(this.c);
/* 28 */     if (this.left) {
/* 29 */       paramGraphics.fillRect(0, j / 2 - 2, i / 2 + 2, 4);
/*    */     }
/* 31 */     if (this.right) {
/* 32 */       paramGraphics.fillRect(i / 2 - 2, j / 2 - 2, i / 2 + 3, 4);
/*    */     }
/* 34 */     if (this.up) {
/* 35 */       paramGraphics.fillRect(i / 2 - 2, 0, 4, j / 2 + 2);
/*    */     }
/* 37 */     if (this.down) {
/* 38 */       paramGraphics.fillRect(i / 2 - 2, j / 2 - 2, 4, j / 2 + 3);
/*    */     }
/* 40 */     if (this.start)
/* 41 */       paramGraphics.fillOval(i / 4, j / 4, i / 2, j / 2);
/*    */   }
/*    */ 
/*    */   public void occupy(Color paramColor) {
/* 45 */     this.occupied = true;
/* 46 */     this.c = paramColor;
/*    */   }
/*    */ }

/* Location:           C:\Users\user\Documents\tron\trongui.jar
 * Qualified Name:     floor
 * JD-Core Version:    0.6.0
 */