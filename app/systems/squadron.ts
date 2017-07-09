import { World } from "../ecs/entities";
import { Deferred } from "../ecs/deferred";
import { System } from "../ecs/system";
import { NetworkComponent } from "../network/networkComponent";
import { Position, Rotation } from "../systems/spatial";
import { Velocity, AngularVelocity } from "../systems/kinematic";
import { MoveToTarget } from "../systems/moveTo";
import { Vec2, dot, norm, norm2 } from "../vec2/vec2";
import { angleDiff } from "../util/angle";
import { clamp } from "../util/clamp";

export class Squadron implements NetworkComponent
{
  constructor(public flagship : number) {}

  equal(other : Squadron) : boolean { return this.flagship === other.flagship; }
  clone() : Squadron { return new Squadron(this.flagship); }
  serialize() : any[] { return [ this.flagship ]; }
  static deserialize(data : any[]) : Squadron { return new Squadron(data[0] as number); }

  static readonly t : string = "Squadron";
};

export class SquadronMember implements NetworkComponent
{
  constructor(public squadron : number, public offset : Vec2) {}

  equal(other : SquadronMember) : boolean { return this.squadron === other.squadron && ((this.offset === null && other.offset === null) || (this.offset !== null && other.offset !== null && this.offset.equal(other.offset))); }
  clone() : SquadronMember { return new SquadronMember(this.squadron, this.offset ? this.offset.clone() : null); }
  serialize() : any[] { return [ this.squadron, ...(this.offset ? [ this.offset.x, this.offset.y ] : [ null, null ]) ]; }
  static deserialize(data : any[]) : SquadronMember { return new SquadronMember(data[0] as number, data[1] ? new Vec2(data[1] as number, data[2] as number) : null); }

  static readonly t : string = "SquadronMember";
};

export class CheckSquadronIntegrity implements System
{
  update(dt : number, world : World, deferred : Deferred)
  {
    world.forEachEntity([Squadron.t], (id : number, components : any[]) =>
    {
      let [squadron] = components as [Squadron];
      let squadronId = id;
      if (!world.containsEntity(squadron.flagship))
      {
        let members = world.findEntities([SquadronMember.t], (id : number, components : any[]) =>
        {
          let [member] = components as [SquadronMember];
          return member.squadron == squadronId;
        });
        if (members.length > 0)
        {
          squadron.flagship = members[0];
          deferred.push((world : World) =>
          {
            let leadMember = world.getComponent(members[0], SquadronMember.t) as SquadronMember;
            let offset = leadMember.offset;
            leadMember.offset = null;
            for (let i = 1; i < members.length; ++i)
            {
              (world.getComponent(members[i], SquadronMember.t) as SquadronMember).offset.subtract(offset);
            }
          });
        }
        else
        {
          deferred.push((world : World) => { world.removeEntity(squadronId); });
        }
      }
    });
  }
};

export class SquadronMovement implements System
{
  constructor(public speed : number, public angularSpeed : number) {}

  update(dt : number, world : World, deferred : Deferred)
  {
    world.forEachEntity([Position.t, Rotation.t, Velocity.t, AngularVelocity.t, SquadronMember.t], (id : number, components : any[]) =>
    {
      let [position, rotation, velocity, angularVelocity, squadronMember] = components as [Position, Rotation, Velocity, AngularVelocity, SquadronMember];
      let [squadron, squadronTarget] = world.getComponents(squadronMember.squadron, [Squadron.t, MoveToTarget.t]) as [Squadron, MoveToTarget];
      let [flagshipPosition, flagshipRotation] = world.getComponents(squadron.flagship, [Position.t, Rotation.t]) as [Position, Rotation];
      let targetVelocity = Vec2.zero.clone();
      let targetAngle = flagshipRotation.angle;
      if (squadronTarget.order.kind === "MoveTo")
      {
        const toTarget = squadronTarget.order.target.clone().subtract(flagshipPosition.pos);
        if (norm(toTarget) > 0.25)
        {
          targetVelocity = targetVelocity.add(toTarget.normalized().multiply(this.speed));
          targetAngle = toTarget.angle();
        }
      }
      if (squadronMember.offset)
      {
        let formationPosition = flagshipPosition.pos.clone().add(squadronMember.offset.rotated(flagshipRotation.angle));
        let formationOffset = formationPosition.clone().subtract(position.pos);
        if (norm(formationOffset) > 0.25)
        {
          targetVelocity = targetVelocity.add(formationOffset.normalized().multiply(0.25 * this.speed));
          targetAngle = targetVelocity.angle();
        }
      }
      velocity.vel = targetVelocity;
      angularVelocity.vel = Math.sign(angleDiff(rotation.angle, targetAngle)) * this.angularSpeed;
    });
  }
};