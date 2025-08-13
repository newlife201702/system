export default `<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="17.0.2">
<process id="Process_1" isExecutable="false">
<task id="Activity_1izv95z">
<documentation type="bpmn:event8"/>
<incoming>Flow_0xnb63d</incoming>
<outgoing>Flow_1sxxaye</outgoing>
</task>
<task id="Activity_0tak16k">
<documentation type="bpmn:event9"/>
<incoming>Flow_0lfjr9t</incoming>
<outgoing>Flow_042w2mu</outgoing>
</task>
<task id="Activity_1yx83yf">
<documentation type="bpmn:event10"/>
<incoming>Flow_1sxxaye</incoming>
<outgoing>Flow_0lfjr9t</outgoing>
</task>
<task id="Activity_04ntj82">
<documentation type="bpmn:event1"/>
<outgoing>Flow_0xnb63d</outgoing>
</task>
<sequenceFlow id="Flow_0xnb63d" sourceRef="Activity_04ntj82" targetRef="Activity_1izv95z"/>
<sequenceFlow id="Flow_1sxxaye" sourceRef="Activity_1izv95z" targetRef="Activity_1yx83yf"/>
<sequenceFlow id="Flow_0lfjr9t" sourceRef="Activity_1yx83yf" targetRef="Activity_0tak16k"/>
<task id="Activity_1jrxtkd">
<documentation type="bpmn:event2"/>
<incoming>Flow_042w2mu</incoming>
</task>
<sequenceFlow id="Flow_042w2mu" sourceRef="Activity_0tak16k" targetRef="Activity_1jrxtkd"/>
</process>
<bpmndi:BPMNDiagram id="BpmnDiagram_1">
<bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1">
<bpmndi:BPMNEdge id="Flow_042w2mu_di" bpmnElement="Flow_042w2mu">
<di:waypoint x="725" y="590"/>
<di:waypoint x="835" y="590"/>
<di:waypoint x="835" y="654"/>
<di:waypoint x="465" y="654"/>
</bpmndi:BPMNEdge>
<bpmndi:BPMNEdge id="Flow_0lfjr9t_di" bpmnElement="Flow_0lfjr9t">
<di:waypoint x="550" y="523"/>
<di:waypoint x="550" y="545"/>
<di:waypoint x="640" y="545"/>
<di:waypoint x="640" y="567"/>
</bpmndi:BPMNEdge>
<bpmndi:BPMNEdge id="Flow_1sxxaye_di" bpmnElement="Flow_1sxxaye">
<di:waypoint x="480" y="373"/>
<di:waypoint x="480" y="425"/>
<di:waypoint x="550" y="425"/>
<di:waypoint x="550" y="477"/>
</bpmndi:BPMNEdge>
<bpmndi:BPMNEdge id="Flow_0xnb63d_di" bpmnElement="Flow_0xnb63d">
<di:waypoint x="250" y="163"/>
<di:waypoint x="250" y="295"/>
<di:waypoint x="480" y="295"/>
<di:waypoint x="480" y="327"/>
</bpmndi:BPMNEdge>
<bpmndi:BPMNShape id="Activity_04ntj82_di" bpmnElement="Activity_04ntj82">
<dc:Bounds x="165" y="117" width="170" height="46"/>
</bpmndi:BPMNShape>
<bpmndi:BPMNShape id="Activity_1izv95z_di" bpmnElement="Activity_1izv95z">
<dc:Bounds x="395" y="327" width="170" height="46"/>
</bpmndi:BPMNShape>
<bpmndi:BPMNShape id="Activity_1yx83yf_di" bpmnElement="Activity_1yx83yf">
<dc:Bounds x="465" y="477" width="170" height="46"/>
</bpmndi:BPMNShape>
<bpmndi:BPMNShape id="Activity_0tak16k_di" bpmnElement="Activity_0tak16k">
<dc:Bounds x="555" y="567" width="170" height="46"/>
</bpmndi:BPMNShape>
<bpmndi:BPMNShape id="Activity_1jrxtkd_di" bpmnElement="Activity_1jrxtkd">
<dc:Bounds x="295" y="644" width="170" height="46"/>
</bpmndi:BPMNShape>
</bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
</definitions>`
