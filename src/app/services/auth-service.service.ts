import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../types/user';
import { catchError, map, Observable, of, Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  apiUrl = "http://localhost:3000/users";


  constructor(private http: HttpClient) { }

  private loginStatusSubject= new Subject<boolean>();
  loginStatus$ = this.loginStatusSubject.asObservable();

  updateLoginStatus(isLoggedIn: boolean){
    this.loginStatusSubject.next(isLoggedIn)
  }

  createUser(userData: User){
    return this.http.post<User>(this.apiUrl, userData);
  }
  updateUser(id:any, userData: any){
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData)
  }
  deleteUser(id:string){
    return this.http.delete(`${this.apiUrl}/${id}}`);
  }
  getAllUsers():Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl)
  }
  getUserById(id:string):Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(catchError((error: any)=> {
      return throwError("user not available");
    }));
  }

  // getUserrole(){
  //   const role = sessionStorage.getItem('userrole');
  //   return role !== null ?role.toString():'';
  // }

  getUserrole() {
    const role = sessionStorage.getItem('userrole');
    return role !== null ? role : ''; // Return empty string if no role found
  }

  isLoggedIn(){
    return sessionStorage.getItem('username') !== null;
  }

  login(id:string, password:string):Observable<any>{
    return this.getUserById(id).pipe(
      map((res:any)=>{
        if(res && res.password === password && res.isActive){
          sessionStorage.setItem('username', res.id);
          sessionStorage.setItem('userrole', res.role);
          console.log('User role set in session storage:', sessionStorage.getItem('userrole'));
          this.updateLoginStatus(true);
          return{success: true, role: res.role};
        }else{
          return {success:false,
          message: "invalid credentials or user Inactive"}
        }
      }),
      catchError((error: any)=>{
        return throwError(()=>new Error("user Not found"))
      })
    )
  }
  // login(id: string, password: string): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/login`, { id, password }).pipe(
  //     map((res) => {
  //       if (res.success) {
  //         sessionStorage.setItem('username', id);
  //         sessionStorage.setItem('userrole', res.role);
  //         this.updateLoginStatus(true);
  //       }
  //       return res; // Return the response
  //     }),
  //     catchError((error) => {
  //       return throwError(() => new Error("Login failed"));
  //     })
  //   );
  // }

  logout():Observable<any>{
    console.log('session', sessionStorage);
    this.updateLoginStatus(false);
    sessionStorage.clear();
    return of({success: true, role:''});
  }

}
