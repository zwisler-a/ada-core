import { ApiProperty } from "@nestjs/swagger";
import { NodeInputDto } from "./node-input.dto";
import { NodeOutputDto } from "./node-output.dto";

export class NodeDto {
    @ApiProperty()
    identifier: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    inputs: NodeInputDto[];
    @ApiProperty()
    outputs: NodeOutputDto[];
}