import { ApiProperty } from "@nestjs/swagger";

export class NodeOutputDto {
    @ApiProperty()
    identifier: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string;
}