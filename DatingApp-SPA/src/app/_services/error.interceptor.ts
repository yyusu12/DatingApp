import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: import('@angular/common/http').HttpRequest<any>,
    next: import('@angular/common/http').HttpHandler
  ): import('rxjs').Observable<import('@angular/common/http').HttpEvent<any>> {
    // tslint:disable-next-line: no-shadowed-variable
    return next.handle(req).pipe(catchError (error => {
        // checking if error is 401 and throwing it back to the component
        if (error.status === 401){return throwError(error.statusText); }
        // checkiing if error is 500 server error and getting them from our headers
        if (error instanceof HttpErrorResponse){const applicationError = error.headers.get('Application-Error');
                                                // checking and throwing the error to the component
                                                if (applicationError){return throwError(applicationError); }
    }
        // handling modalState errors
        const serverError = error.error;
        let modalStateErrors = '';
        // checking if error is !empty and is of type object
        if (serverError.errors && typeof serverError.errors === 'object'){
            for (const key in serverError.errors)
            {
                if (serverError.errors[key])
                {
                    modalStateErrors += serverError.errors[key] + '\n';
                }
            }
        }
        // send the exception to the component
        return throwError(modalStateErrors || serverError || 'Server Error');
    }));
  }
}
export const ErrorInterceptorProvider = {

    provide : HTTP_INTERCEPTORS,
    useClass : ErrorInterceptor,
    multi : true
};
