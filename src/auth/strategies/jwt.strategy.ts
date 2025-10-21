import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {

    super({
      // Step 1: Tell Passport WHERE to find the token
      // "Look in the Authorization header for 'Bearer <token>'"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // Step 2: Tell Passport to REJECT expired tokens
      ignoreExpiration: false,
      
      // Step 3: Tell Passport the SECRET KEY to verify signatures
      // "Use the JWT_SECRET from my .env file"
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET')
    });
  }
  
  public async validate(payload: any) {
  
    // payload.sub matches the userId
    return this.authService.validateUserFromJwt(payload.sub); 
  }
}