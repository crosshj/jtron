/*     */ import java.awt.Color;
/*     */ import java.awt.Container;
/*     */ import java.awt.GridLayout;
/*     */ import java.awt.event.ActionEvent;
/*     */ import java.awt.event.ActionListener;
/*     */ import java.io.File;
/*     */ import java.io.InputStream;
/*     */ import java.io.OutputStream;
/*     */ import java.io.PrintStream;
/*     */ import javax.swing.JButton;
/*     */ import javax.swing.JColorChooser;
/*     */ import javax.swing.JDialog;
/*     */ import javax.swing.JFileChooser;
/*     */ import javax.swing.JFrame;
/*     */ import javax.swing.JLabel;
/*     */ import javax.swing.JMenu;
/*     */ import javax.swing.JMenuBar;
/*     */ import javax.swing.JOptionPane;
/*     */ import javax.swing.JPanel;
/*     */ import javax.swing.JTextField;
/*     */ import javax.swing.SwingUtilities;
/*     */ 
/*     */ public class trongui
/*     */   implements Runnable
/*     */ {
/*     */   JFrame window;
/*  68 */   Color[] color = new Color[2];
/*     */   String prg1;
/*     */   String prg2;
/*     */   JPanel board;
/*     */   JButton begin;
/*     */   Space[][] position;
/*     */   int test;
/*     */   Thread model;
/*     */ 
/*     */   public static void main(String[] paramArrayOfString)
/*     */   {
/*  76 */     new trongui();
/*     */   }
/*     */ 
/*     */   trongui() {
/*  80 */     this.color[0] = Color.blue;
/*  81 */     this.color[1] = Color.red;
/*  82 */     SwingUtilities.invokeLater(this);
/*     */   }
/*     */ 
/*     */   public void run() {
/*  86 */     this.window = new JFrame();
/*  87 */     JMenuBar localJMenuBar = new JMenuBar();
/*  88 */     JMenu localJMenu = new JMenu("Game");
/*     */ 
/*  90 */     localJMenuBar.add(localJMenu);
/*  91 */     JButton localJButton = new JButton("Player Settings");
/*  92 */     localJButton.addActionListener(new ActionListener() {
/*     */       public void actionPerformed(ActionEvent paramActionEvent) {
/*  94 */         new trongui.dialog(trongui.this);
/*     */       }
/*     */     });
/*  97 */     this.begin = new JButton("Begin");
/*  98 */     this.begin.addActionListener(new ActionListener() {
/*     */       public void actionPerformed(ActionEvent paramActionEvent) {
/* 100 */         if (trongui.this.model != null) {
/* 101 */           trongui.this.model.interrupt();
/*     */           try {
/* 103 */             trongui.this.model.join();
/*     */           }
/*     */           catch (Exception localException) {
/* 106 */             System.out.println("I have no idea what just happened");
/*     */           }
/* 108 */           trongui.this.model = null;
/* 109 */           trongui.this.begin.setText("Begin");
/* 110 */           for (int i = 1; i < 32; i++) for (int j = 1; j < 53; j++) {
/* 111 */               ((floor)trongui.this.position[i][j]).occupied = false;
/* 112 */               ((floor)trongui.this.position[i][j]).up = false;
/* 113 */               ((floor)trongui.this.position[i][j]).right = false;
/* 114 */               ((floor)trongui.this.position[i][j]).down = false;
/* 115 */               ((floor)trongui.this.position[i][j]).left = false;
/*     */             }
/* 117 */           return;
/*     */         }
/*     */ 
/* 120 */         trongui.this.begin.setText("Reset");
/* 121 */         trongui.this.model = new Thread(new Runnable() {
/*     */           public void run() {
/*     */             try {
/* 124 */               trongui.this.play(trongui.this.test);
/*     */             }
/*     */             catch (Exception localException) {
/* 127 */               System.out.println("Caught interrupt");
/*     */             }
/*     */           }
/*     */         });
/* 131 */         trongui.this.model.start();
/*     */       }
/*     */     });
/* 135 */     this.window.add(this.begin, "North");
/* 136 */     this.board = new JPanel(new GridLayout(33, 54));
/* 137 */     localJMenu.add(localJButton);
/* 138 */     this.window.setJMenuBar(localJMenuBar);
/* 139 */     this.position = new Space[33][54];
/* 140 */     for (int i = 0; i < 33; i++) for (int j = 0; j < 54; j++) {
/* 141 */         if ((i == 0) || (i == 32) || (j == 0) || (j == 53)) {
/* 142 */           this.position[i][j] = new wall();
/*     */         }
/*     */         else {
/* 145 */           this.position[i][j] = new floor();
/*     */         }
/* 147 */         this.board.add(this.position[i][j]);
/*     */       }
/* 149 */     this.window.add(this.board, "Center");
/* 150 */     this.window.setDefaultCloseOperation(3);
/* 151 */     this.window.pack();
/* 152 */     this.window.setVisible(true); } 
/* 155 */   public void play(int paramInt) throws Exception { Runtime localRuntime = Runtime.getRuntime();
/*     */ 
/* 157 */     InputStream[] arrayOfInputStream = new InputStream[2];
/* 158 */     OutputStream[] arrayOfOutputStream = new OutputStream[2];
/* 159 */     boolean[] arrayOfBoolean = new boolean[2];
/* 160 */     char[] arrayOfChar = new char[2];
/* 161 */     point[] arrayOfpoint = new point[2];
/*     */     Process localProcess1;
/*     */     try { localProcess1 = localRuntime.exec(this.prg1);
/*     */     } catch (Exception localException1)
/*     */     {
/* 166 */       JOptionPane.showMessageDialog(this.window, "Please enter valid program 1 name", "Error", 0);
/* 167 */       return;
/*     */     }Process localProcess2;
/*     */     try { localProcess2 = localRuntime.exec(this.prg2);
/*     */     } catch (Exception localException2)
/*     */     {
/* 173 */       localProcess1.destroy();
/* 174 */       JOptionPane.showMessageDialog(this.window, "Please enter valid program 2 name", "Error", 0);
/* 175 */       return;
/*     */     }
/* 177 */     arrayOfInputStream[0] = localProcess1.getInputStream();
/* 178 */     arrayOfInputStream[1] = localProcess2.getInputStream();
/* 179 */     arrayOfOutputStream[0] = localProcess1.getOutputStream();
/* 180 */     arrayOfOutputStream[1] = localProcess2.getOutputStream();
/* 181 */     arrayOfpoint[0] = new point(16, 16);
/* 182 */     ((floor)this.position[arrayOfpoint[0].getY()][arrayOfpoint[0].getX()]).occupy(this.color[0]);
/* 183 */     ((floor)this.position[arrayOfpoint[0].getY()][arrayOfpoint[0].getX()]).start = true;
/* 184 */     arrayOfpoint[1] = new point(37, 16);
/* 185 */     ((floor)this.position[arrayOfpoint[1].getY()][arrayOfpoint[1].getX()]).occupy(this.color[1]);
/* 186 */     ((floor)this.position[arrayOfpoint[1].getY()][arrayOfpoint[1].getX()]).start = true;
/*     */     while (true) {
/* 188 */       Thread.sleep(100L);
/* 189 */       arrayOfBoolean[0] = (arrayOfInputStream[0].available() == 0 ? 1 : false);
/* 190 */       if (arrayOfBoolean[0] != 0) System.out.println("0 timed out");
/* 191 */       arrayOfBoolean[1] = (arrayOfInputStream[1].available() == 0 ? 1 : false);
/* 192 */       if (arrayOfBoolean[1] != 0) System.out.println("1 timed out");
/* 193 */       if ((arrayOfBoolean[0] == 0) && (arrayOfBoolean[1] == 0)) {
/* 194 */         for (int i = 0; i < 2; i++) {
/* 195 */           if (arrayOfBoolean[i] == 0) {
/* 196 */             arrayOfChar[i] = (char)arrayOfInputStream[i].read();
/* 197 */             if (i == 1) {
/* 198 */               if (arrayOfChar[1] == 'l') arrayOfChar[1] = 'r';
/* 199 */               else if (arrayOfChar[1] == 'r') arrayOfChar[1] = 'l';
/*     */             }
/* 201 */             switch (arrayOfChar[i]) {
/*     */             case 'u':
/* 203 */               ((floor)this.position[arrayOfpoint[i].getY()][arrayOfpoint[i].getX()]).up = true;
/* 204 */               arrayOfpoint[i].translate(0, -1);
/* 205 */               if (this.position[arrayOfpoint[i].getY()][arrayOfpoint[i].getX()].isOccupied()) {
/* 206 */                 System.out.println(i + " made invalid move up");
/* 207 */                 arrayOfBoolean[i] = true;
/*     */               }
/*     */               else {
/* 210 */                 ((floor)this.position[arrayOfpoint[i].getY()][arrayOfpoint[i].getX()]).down = true;
/* 211 */                 ((floor)this.position[arrayOfpoint[i].getY()][arrayOfpoint[i].getX()]).occupy(this.color[i]);
/*     */               }
/* 213 */               break;
/*     */             case 'd':
/* 215 */               ((floor)this.position[arrayOfpoint[i].getY()][arrayOfpoint[i].getX()]).down = true;
/* 216 */               arrayOfpoint[i].translate(0, 1);
/* 217 */               if (this.position[arrayOfpoint[i].getY()][arrayOfpoint[i].getX()].isOccupied()) {
/* 218 */                 System.out.println(i + " made invalid move down");
/* 219 */                 arrayOfBoolean[i] = true;
/*     */               }
/*     */               else {
/* 222 */                 ((floor)this.position[arrayOfpoint[i].getY()][arrayOfpoint[i].getX()]).up = true;
/* 223 */                 ((floor)this.position[arrayOfpoint[i].getY()][arrayOfpoint[i].getX()]).occupy(this.color[i]);
/*     */               }
/* 225 */               break;
/*     */             case 'l':
/* 227 */               ((floor)this.position[arrayOfpoint[i].getY()][arrayOfpoint[i].getX()]).left = true;
/* 228 */               arrayOfpoint[i].translate(-1, 0);
/* 229 */               if (this.position[arrayOfpoint[i].getY()][arrayOfpoint[i].getX()].isOccupied()) {
/* 230 */                 System.out.println(i + " made invalid move left");
/* 231 */                 arrayOfBoolean[i] = true;
/*     */               }
/*     */               else {
/* 234 */                 ((floor)this.position[arrayOfpoint[i].getY()][arrayOfpoint[i].getX()]).right = true;
/* 235 */                 ((floor)this.position[arrayOfpoint[i].getY()][arrayOfpoint[i].getX()]).occupy(this.color[i]);
/*     */               }
/* 237 */               break;
/*     */             case 'r':
/* 239 */               ((floor)this.position[arrayOfpoint[i].getY()][arrayOfpoint[i].getX()]).right = true;
/* 240 */               arrayOfpoint[i].translate(1, 0);
/* 241 */               if (this.position[arrayOfpoint[i].getY()][arrayOfpoint[i].getX()].isOccupied()) {
/* 242 */                 System.out.println(i + " made invalid move right");
/* 243 */                 arrayOfBoolean[i] = true;
/*     */               }
/*     */               else {
/* 246 */                 ((floor)this.position[arrayOfpoint[i].getY()][arrayOfpoint[i].getX()]).left = true;
/* 247 */                 ((floor)this.position[arrayOfpoint[i].getY()][arrayOfpoint[i].getX()]).occupy(this.color[i]);
/*     */               }
/* 249 */               break;
/*     */             default:
/* 251 */               arrayOfBoolean[i] = true;
/* 252 */               System.out.println(i + " invalid character");
/*     */             }
/*     */           }
/*     */         }
/*     */ 
/* 257 */         if (((arrayOfBoolean[0] != 0) && (arrayOfBoolean[1] != 0)) || ((arrayOfBoolean[0] == 0) && (arrayOfpoint[0].equals(arrayOfpoint[1])))) {
/* 258 */           JOptionPane.showMessageDialog(this.window, "Tie!", "Tie!", 1);
/* 259 */           break;
/*     */         }
/* 261 */         if (arrayOfBoolean[0] != 0) {
/* 262 */           JOptionPane.showMessageDialog(this.window, "Player 2 wins!", "Player 2 wins!", 1);
/* 263 */           break;
/*     */         }
/* 265 */         if (arrayOfBoolean[1] != 0) {
/* 266 */           JOptionPane.showMessageDialog(this.window, "Player 1 wins!", "Player 1 wins!", 1);
/* 267 */           break;
/*     */         }
/* 269 */         if (arrayOfChar[0] == 'l') arrayOfChar[0] = 'r';
/* 270 */         else if (arrayOfChar[0] == 'r') arrayOfChar[0] = 'l';
/* 271 */         arrayOfOutputStream[0].write(arrayOfChar[1]);
/* 272 */         arrayOfOutputStream[0].flush();
/* 273 */         arrayOfOutputStream[1].write(arrayOfChar[0]);
/* 274 */         arrayOfOutputStream[1].flush();
/* 275 */         this.window.repaint();
/*     */       }
/*     */     }
/* 277 */     localProcess1.destroy();
/* 278 */     localProcess2.destroy(); } 
/*     */   class dialog extends JDialog { JDialog d;
/*     */     Container c;
/*     */     JButton c1;
/*     */     JButton c2;
/*     */     JButton p1;
/*     */     JButton p2;
/*     */     JButton set;
/*     */     Color col1;
/*     */     Color col2;
/*     */     String f1;
/*     */     String f2;
/*     */     JFileChooser fc;
/*     */     JPanel p;
/*     */     JTextField t1;
/*     */     JTextField t2;
/*     */ 
/* 290 */     dialog() { super("Enter Player information", true);
/* 291 */       this.d = this;
/* 292 */       this.fc = new JFileChooser();
/* 293 */       this.p = new JPanel(new GridLayout(4, 2));
/* 294 */       this.c = getContentPane();
/* 295 */       this.set = new JButton("Set");
/* 296 */       this.p.setLayout(new GridLayout(4, 2));
/* 297 */       this.p.add(new JLabel("Player 1"));
/* 298 */       this.p.add(new JLabel("Player 2"));
/* 299 */       this.col1 = trongui.this.color[0];
/* 300 */       this.col2 = trongui.this.color[1];
/* 301 */       this.c1 = new JButton();
/* 302 */       this.c1.setBackground(trongui.this.color[0]);
/* 303 */       this.c1.addActionListener(new ActionListener(trongui.this) {
/*     */         public void actionPerformed(ActionEvent paramActionEvent) {
/* 305 */           Color localColor = JColorChooser.showDialog(trongui.dialog.this.d, "Choose color for Player 1", trongui.dialog.this.col1);
/* 306 */           if (localColor != null) {
/* 307 */             trongui.dialog.this.col1 = localColor;
/* 308 */             trongui.dialog.this.c1.setBackground(localColor);
/*     */           }
/*     */         }
/*     */       });
/* 312 */       this.p.add(this.c1);
/* 313 */       this.c2 = new JButton();
/* 314 */       this.c2.setBackground(trongui.this.color[1]);
/* 315 */       this.c2.addActionListener(new ActionListener(trongui.this) {
/*     */         public void actionPerformed(ActionEvent paramActionEvent) {
/* 317 */           Color localColor = JColorChooser.showDialog(trongui.dialog.this.d, "Choose color for Player 2", trongui.dialog.this.col2);
/* 318 */           if (localColor != null) {
/* 319 */             trongui.dialog.this.col2 = localColor;
/* 320 */             trongui.dialog.this.c2.setBackground(localColor);
/*     */           }
/*     */         }
/*     */       });
/* 324 */       this.p.add(this.c2);
/*     */ 
/* 326 */       this.p1 = new JButton("Choose program");
/* 327 */       this.p1.addActionListener(new ActionListener(trongui.this) {
/*     */         public void actionPerformed(ActionEvent paramActionEvent) {
/* 329 */           if (trongui.dialog.this.fc.showDialog(trongui.dialog.this.d, "I choose you!") == 0) {
/* 330 */             trongui.dialog.this.f1 = trongui.dialog.this.fc.getSelectedFile().getAbsolutePath();
/* 331 */             trongui.dialog.this.t1.setText(trongui.dialog.this.f1);
/*     */           }
/*     */         }
/*     */       });
/* 335 */       this.p.add(this.p1);
/* 336 */       this.p2 = new JButton("Choose program");
/* 337 */       this.p2.addActionListener(new ActionListener(trongui.this) {
/*     */         public void actionPerformed(ActionEvent paramActionEvent) {
/* 339 */           if (trongui.dialog.this.fc.showDialog(trongui.dialog.this.d, "I choose you!") == 0) {
/* 340 */             trongui.dialog.this.f2 = trongui.dialog.this.fc.getSelectedFile().getAbsolutePath();
/* 341 */             trongui.dialog.this.t2.setText(trongui.dialog.this.f2);
/*     */           }
/*     */         }
/*     */       });
/* 345 */       this.p.add(this.p2);
/*     */ 
/* 347 */       this.t1 = new JTextField(trongui.this.prg1);
/* 348 */       this.p.add(this.t1);
/* 349 */       this.t2 = new JTextField(trongui.this.prg2);
/* 350 */       this.p.add(this.t2);
/*     */ 
/* 352 */       this.set.addActionListener(new ActionListener(trongui.this) {
/*     */         public void actionPerformed(ActionEvent paramActionEvent) {
/* 354 */           trongui.this.color[0] = trongui.dialog.this.col1;
/* 355 */           trongui.this.color[1] = trongui.dialog.this.col2;
/* 356 */           trongui.this.prg1 = trongui.dialog.this.t1.getText();
/* 357 */           trongui.this.prg2 = trongui.dialog.this.t2.getText();
/* 358 */           trongui.dialog.this.d.dispose();
/*     */         }
/*     */       });
/* 361 */       this.c.add(this.p, "Center");
/* 362 */       this.c.add(this.set, "South");
/* 363 */       pack();
/* 364 */       setVisible(true);
/*     */     }
/*     */   }
/*     */ }

/* Location:           C:\Users\user\Documents\tron\trongui.jar
 * Qualified Name:     trongui
 * JD-Core Version:    0.6.0
 */