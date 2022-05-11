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
void opp_pos(void);

char moves[4] = {'u','d','l','r'};
short int opp_x = 0, opp_y = 0;

int main()
{
  start1();
  //srand ( time(NULL) );
  //char str [2];
  //test2();
  while(1){
   move_random();
  }
}

void move_random(void){
  putchar(moves[rand() % 4]);
  fflush(stdout);
  opp_pos();

}

void start1(void)
{
  int i=0,j,k,l,m,n,q;

  for (j=10, k=15, l=25,m=10, n=14, q=1; j>0; j--,k-=2, m--, l-=2, n-=2, q++)
  {
    // push center
    for (i=0;i<m;i++){
     putchar('r');
     fflush(stdout);
     opp_pos();

    }


    // go up
    for (i=0;i<k;i++){
     putchar('u');
     fflush(stdout);
     opp_pos();

    }

      // go left
    for (i=0;i<l;i++){
     putchar('l');
     fflush(stdout);
     opp_pos();

    }
      // go down
    for (i=0;i<k;i++){
     putchar('d');
     fflush(stdout);
     opp_pos();

    }
      // go right
    for (i=0;i<n;i++){
     putchar('r');
     fflush(stdout);
     opp_pos();

    }

    putchar('u');
    fflush(stdout);
    opp_pos();

    for (i= 0;i<q;i++){
      putchar('r');
      fflush(stdout);
      opp_pos();
    }


 }
  // go up
  for (i=0;i<14;i++){
   putchar('u');
   fflush(stdout);
   opp_pos();

  }

  // at top, decide
  if (opp_x < -10 )
  {
      moves[2] = 'r';
      moves[3] = 'l';
  }

  if (opp_x > -10 & opp_y > -7 )
  {
      moves[2] = 'r';
      moves[3] = 'l';
  }

  for (i=0;i<24;i++)
  {
     putchar(moves[2]);
     fflush(stdout);
     opp_pos();
  }


  for (i=0;i<24 ;i++){
   putchar('d');
   fflush(stdout);
   opp_pos();

  }
   putchar(moves[2]);
   fflush(stdout);
   opp_pos();



  for (i=0;i<15;i++){
   putchar('u');
   fflush(stdout);
   opp_pos();

  }

  for (i=0;i<51;i++){
   putchar(moves[3]);
   fflush(stdout);
   opp_pos();

  }

  putchar('d');
  fflush(stdout);
  opp_pos();

///
  putchar('d');
  fflush(stdout);
  opp_pos();

  putchar('d');
  fflush(stdout);
  opp_pos();

  putchar(moves[2]);
  fflush(stdout);
  opp_pos();

  putchar(moves[3]);
  fflush(stdout);
  opp_pos();

  putchar('u');
  fflush(stdout);
  opp_pos();

  putchar('u');
  fflush(stdout);
  opp_pos();

  putchar('u');
  fflush(stdout);
  opp_pos();

  putchar('l');
  fflush(stdout);
  opp_pos();

  putchar('u');
  fflush(stdout);
  opp_pos();

  //////
  putchar('u');
  fflush(stdout);
  opp_pos();

  putchar('l');
  fflush(stdout);
  opp_pos();

  putchar('l');
  fflush(stdout);
  opp_pos();

  putchar('l');
  fflush(stdout);
  opp_pos();

  putchar('d');
  fflush(stdout);
  opp_pos();

  putchar('d');
  fflush(stdout);
  opp_pos();

  putchar('r');
  fflush(stdout);
  opp_pos();

  putchar('r');
  fflush(stdout);
  opp_pos();

  putchar('u');
  fflush(stdout);
  opp_pos();

  putchar('r');
  fflush(stdout);
  opp_pos();

  putchar('d');
  fflush(stdout);
  opp_pos();

}

void opp_pos(void){

   char move = getchar();
   fflush(stdin);

   switch (move)
   {
      case 'u':
         opp_y--;
         break;

      case 'd':
         opp_y++;
         break;

      case 'l':
         opp_x--;
         break;

      case 'r':
         opp_x++;
         break;

   }

}


void test1(void){
  putchar('l');
  fflush(stdout);
  opp_pos();

  putchar('l');
  fflush(stdout);
  opp_pos();



  putchar('u');
  fflush(stdout);
  opp_pos();

  putchar('l');
  fflush(stdout);
  opp_pos();

  putchar('d');
  fflush(stdout);
  opp_pos();

  putchar('l');
  fflush(stdout);
  opp_pos();

  putchar('u');
  fflush(stdout);
  opp_pos();

  putchar('u');
  fflush(stdout);
  opp_pos();

  putchar('u');
  fflush(stdout);
  opp_pos();

  putchar('r');
  fflush(stdout);
  opp_pos();

  putchar('u');
  fflush(stdout);
  opp_pos();

  //////
  putchar('u');
  fflush(stdout);
  opp_pos();

  putchar('r');
  fflush(stdout);
  opp_pos();

  putchar('r');
  fflush(stdout);
  opp_pos();

  putchar('r');
  fflush(stdout);
  opp_pos();

  putchar('d');
  fflush(stdout);
  opp_pos();

  putchar('d');
  fflush(stdout);
  opp_pos();

  putchar('l');
  fflush(stdout);
  opp_pos();

  putchar('l');
  fflush(stdout);
  opp_pos();

  putchar('u');
  fflush(stdout);
  opp_pos();

  putchar('l');
  fflush(stdout);
  opp_pos();

  putchar('d');
  fflush(stdout);
  opp_pos();


}



void test2(void){
  putchar('r');
  fflush(stdout);
  opp_pos();

  putchar('r');
  fflush(stdout);
  opp_pos();



  putchar('u');
  fflush(stdout);
  opp_pos();

  putchar('r');
  fflush(stdout);
  opp_pos();

  putchar('d');
  fflush(stdout);
  opp_pos();

  putchar('r');
  fflush(stdout);
  opp_pos();

  putchar('u');
  fflush(stdout);
  opp_pos();

  putchar('u');
  fflush(stdout);
  opp_pos();

  putchar('u');
  fflush(stdout);
  opp_pos();

  putchar('l');
  fflush(stdout);
  opp_pos();

  putchar('u');
  fflush(stdout);
  opp_pos();

  //////
  putchar('u');
  fflush(stdout);
  opp_pos();

  putchar('l');
  fflush(stdout);
  opp_pos();

  putchar('l');
  fflush(stdout);
  opp_pos();

  putchar('l');
  fflush(stdout);
  opp_pos();

  putchar('d');
  fflush(stdout);
  opp_pos();

  putchar('d');
  fflush(stdout);
  opp_pos();

  putchar('r');
  fflush(stdout);
  opp_pos();

  putchar('r');
  fflush(stdout);
  opp_pos();

  putchar('u');
  fflush(stdout);
  opp_pos();

  putchar('r');
  fflush(stdout);
  opp_pos();

  putchar('d');
  fflush(stdout);
  opp_pos();


}

