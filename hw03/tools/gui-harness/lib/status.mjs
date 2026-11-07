export function assess({nativeStatus,requested,oracleFailure=false,technicalFailure=false}){
 if(technicalFailure)return {assessment:'blocked',reason:'technical-execution-error'};
 if(requested==='blocked')return {assessment:'blocked',reason:null};
 if(nativeStatus==='passed')return {assessment:requested||'pass',reason:null};
 if(nativeStatus==='failed'&&oracleFailure)return {assessment:'fail',reason:'oracle-mismatch'};
 return {assessment:'blocked',reason:nativeStatus==='timedOut'?'harness-timeout':'technical-execution-error'};
}
