// This C++ code is taken shameless from http://www.leetcode.com/2011/02/coins-in-line.html
// Solving the 2nd part of the problem.
/* The Problem: 
There are n coins in a line. (Assume n is even). Two players take turns to take a coin from one of the ends of the line until there are no more coins left. The player with the larger amount of money wins.

Would you rather go first or second? Does it matter?
Assume that you go first, describe an algorithm to compute the maximum amount of money you can win.
*/

#include <iostream>
using namespace std;

const int MAX_N = 100;
 
void printMoves(int P[][MAX_N], int A[], int N) {
  int sum1 = 0, sum2 = 0;
  int m = 0, n = N-1;
  bool myTurn = true;
  while (m <= n) {
    int P1 = P[m+1][n]; // If take A[m], opponent can get...
    int P2 = P[m][n-1]; // If take A[n]
    cout << (myTurn ? "I" : "You") << " take coin no. ";
    if (P1 <= P2) {
      cout << m+1 << " (" << A[m] << ")";
      m++;
    } else {
      cout << n+1 << " (" << A[n] << ")";
      n--;
    }
    cout << (myTurn ? ", " : ".\n");
    myTurn = !myTurn;
  }
  cout << "\nThe total amount of money (maximum) I get is " << P[0][N-1] << ".\n";
}
 
int maxMoney(int A[], int N) {
  int P[MAX_N][MAX_N] = {0};
  int a, b, c;
  for (int i = 0; i < N; i++) {
    for (int m = 0, n = i; n < N; m++, n++) {
      assert(m < N); assert(n < N);
      a = ((m+2 <= N-1)             ? P[m+2][n] : 0);
      b = ((m+1 <= N-1 && n-1 >= 0) ? P[m+1][n-1] : 0);
      c = ((n-2 >= 0)               ? P[m][n-2] : 0);
      P[m][n] = max(A[m] + min(a,b),
                    A[n] + min(b,c));
    }
  }
  printMoves(P, A, N);
  return P[0][N-1];
}

int main() {
    int a[] = {10, 25, 50, 5, 10, 5, 5, 10, 25, 50};
    int n = 10;
    
    cout<<maxMoney(a, n);
    
    
    return 0;
}