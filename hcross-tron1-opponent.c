/* ========================================================================== */
/*                                                                            */
/*   Filename.c                                                               */
/*   (c) 2001 Author                                                          */
/*                                                                            */
/*   Description                                                              */
/*                                                                            */
/* ========================================================================== */

#include <stdio.h>
#include <stdlib.h>
#include <time.h>

void test1(void);
void test2(void);
void start1(void);
void move_random(void);

char moves[4] = {'u','d','l','r'};

void main()
{
  start1();
  srand ( time(NULL) );
  //char str [2];
  //test2();
  while(1){
   move_random();
  }
}

void move_random(void){
  putchar(moves[rand() % 4]);
  fflush(stdout);
  getchar();
  fflush(stdin);
}

void test1(void){
  putchar('l');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('l');
  fflush(stdout);
  getchar();
  fflush(stdin);


  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('l');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('d');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('l');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('r');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  //////
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('r');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('r');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('r');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('d');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('d');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('l');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('l');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('l');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('d');
  fflush(stdout);
  getchar();
  fflush(stdin);

}



void test2(void){
  putchar('r');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('r');
  fflush(stdout);
  getchar();
  fflush(stdin);


  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('r');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('d');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('r');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('l');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  //////
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('l');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('l');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('l');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('d');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('d');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('r');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('r');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('r');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('d');
  fflush(stdout);
  getchar();
  fflush(stdin);

}


void start1(void)
{
  int i=0;

  for (i=0;i<0;i++){
   putchar('r');
   fflush(stdout);
   getchar();
   fflush(stdin);
  }
  for (i=0;i<15;i++)
  {
   putchar('u');
   fflush(stdout);
   getchar();
   fflush(stdin);
  }

   putchar('r');
   fflush(stdout);
   getchar();
   fflush(stdin);


  for (i=0;i<16;i++)
  {
   putchar('d');
   fflush(stdout);
   getchar();
   fflush(stdin);
  }

  // long push left
  for (i=0;i<35;i++)
  {
   putchar('r');
   fflush(stdout);
   getchar();
   fflush(stdin);
  }

   putchar('d');
   fflush(stdout);
   getchar();
   fflush(stdin);
int k;
for (k=0; k<10; k++)
{
  // really long push right
  for (i=0;i<50;i++){
   putchar('l');
   fflush(stdout);
   getchar();
   fflush(stdin);
  }
   putchar('d');
   fflush(stdout);
   getchar();
   fflush(stdin);

  // really long push left
  for (i=0;i<50;i++){
   putchar('r');
   fflush(stdout);
   getchar();
   fflush(stdin);
  }
   putchar('d');
   fflush(stdout);
   getchar();
   fflush(stdin);

}



  for (i=0;i<51;i++){
   putchar('r');
   fflush(stdout);
   getchar();
   fflush(stdin);
  }

  putchar('r');
  fflush(stdout);
  getchar();
  fflush(stdin);
///
  putchar('r');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('d');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('l');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('r');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('l');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  //////
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('l');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('l');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('l');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('d');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('d');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('r');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('r');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('u');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('r');
  fflush(stdout);
  getchar();
  fflush(stdin);
  putchar('d');
  fflush(stdout);
  getchar();
  fflush(stdin);
}