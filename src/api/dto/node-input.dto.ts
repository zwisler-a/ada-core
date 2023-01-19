import { ApiProperty } from "@nestjs/swagger";

export class NodeInputDto {
    @ApiProperty()
    identifier: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string;
}