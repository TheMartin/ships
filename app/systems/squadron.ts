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

export class Squadron
{
  constructor(public flagship : number) {}
  static readonly t : string = "Squadron";
};

export class SquadronMember
{
  constructor(public squadron : number, public offset : Vec2) {}
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