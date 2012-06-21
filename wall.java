/*    */ import java.awt.Color;
/*    */ import java.awt.Dimension;
/*    */ import java.awt.Graphics;
/*    */ 
/*    */ class wall extends Space
/*    */ {
/*    */   public boolean isOccupied()
/*    */   {
/* 52 */     return true;
/*    */   }
/*    */   public Dimension getPreferredSize() {
/* 55 */     return new Dimension(10, 10);
/*    */   }
/*    */ 
/*    */   protected void paintComponent(Graphics paramGraphics) {
/* 59 */     int i = getWidth();
/* 60 */     int j = getHeight();
/* 61 */     paramGraphics.setColor(Color.green);
/* 62 */     paramGraphics.drawOval(0, 0, i - 1, j - 1);
/*    */   }
/*    */ }

/* Location:           C:\Users\user\Documents\tron\trongui.jar
 * Qualified Name:     wall
 * JD-Core Version:    0.6.0
 */