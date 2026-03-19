import { jwtDecode } from 'jwt-decode';

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

const handleError = (err: HttpErrorResponse) => {
  let errorMessage = 'Errore sconosciuto';

  if (err.status === 0) {
    errorMessage = 'Impossibile contattare il server. Controlla la connessione.';
  } else if (err.status === 401) {
    errorMessage = 'Credenziali non valide.';
  } else if (err.status === 403) {
    errorMessage = 'Accesso negato.';
  } else if (err.error?.message) {
    errorMessage = err.error.message;
  }

  console.error(`Errore HTTP ${err.status}:`, errorMessage, err);
  return throwError(() => new Error(errorMessage));
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('auth_token');

  if (token) {
    console.log('Token trovato:', jwtDecode(token));
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq).pipe(
      catchError((err: HttpErrorResponse) => handleError(err))
    );
  }

  // Richieste senza token (login, registrazione)
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => handleError(err))
  );
};
